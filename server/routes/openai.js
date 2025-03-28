const express = require('express');
const router = express.Router();
const openai = require('../config/openai');
const { verifyToken } = require('../middleware/authMiddleware');

// チャット応答を生成するエンドポイント
router.post('/chat', verifyToken, async (req, res) => {
  try {
    const { messages, studyTopic, model = 'gpt-3.5-turbo' } = req.body;
    const userId = req.user.uid; // 認証されたユーザーID
    
    // システムメッセージを作成
    const systemMessage = {
      role: "system",
      content: `あなたは学習者のサポートをするAIアシスタントです。学習者は現在 ${JSON.stringify(studyTopic)} について学習しています。
    
    **回答時のルール**
    1. **簡潔で役立つアドバイス** を **日本語** で提供してください。
    2. **Markdown形式** で記述し、**見やすい構成** にしてください。
    3. **数式に関する注意点**:
       - **インライン数式**（文中の数式）は **$数式$** の形式で記述してください。
       - **独立した数式**（別行立ての数式）は **$$数式$$** の形式で記述してください。
       - LaTeX記法を正確に使用し、エスケープが必要な記号（\, _, etc）は適切にエスケープしてください。
       - 分数は \frac{分子}{分母} の形式で、複雑な式は適切に括弧で囲んでください。

    **構成に関する注意点**:
    - **見出し（###）やリスト（1., -）を適切に使用**して情報を整理してください。
    - **コードブロックが必要な場合は言語指定を明記**してください（例：\`\`\`python）。
    - 適切に改行を入れて**読みやすさを重視**してください。
    `.trim()
  };
    
    
    // OpenAI APIを呼び出し
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [systemMessage, ...messages],
      temperature: 0.7,
      max_tokens: 2000,
    });

    // 応答を返す
    res.json({ 
      message: completion.choices[0].message.content,
      model: model
    });
    
    // 使用状況を記録することもできます
    // await db.collection('apiUsage').add({
    //   userId,
    //   endpoint: 'chat',
    //   model,
    //   timestamp: new Date(),
    //   studyTopic
    // });
  } catch (error) {
    console.error('OpenAI APIエラー:', error);
    res.status(500).json({ error: error.message || 'OpenAI APIエラー' });
  }
});

// クイズを生成するエンドポイント
router.post('/generate-quiz', verifyToken, async (req, res) => {
  try {
    const { userQuestions, studyTopic } = req.body;
    const userId = req.user.uid; // 認証されたユーザーID
    
    // システムプロンプトを作成
    const systemPrompt = `
    あなたは教育AIアシスタントです。学習者のチャット履歴から、学習内容を確認するための**記述式問題**を **1~5問** 作成してください。  
    学習トピックは **${JSON.stringify(studyTopic)}** です。
    
    ---
    
    ## **出力フォーマット**
    - **JSON 形式** で出力してください（**必ずパース可能な形式** にする）。
    - **問題文** と **解答** は **Markdown 形式** で記述してください。
    - **数式が必要な場合** は **LaTeX 記法（$$ で囲む形式）** を使用してください。
    - **見やすさを考慮し、適切に改行やリストを使ってください**。
    
    ---
    
    ## **出力の例**
    \`\`\`json
    {
      "questions": [
        {
          "question": "### 二次方程式の解の公式を導出してください。",
          "answer": "方程式を $$ a $$ で割ります。\\n\\n$$ x^2 + \\\\frac{b}{a}x + \\\\frac{c}{a} = 0 $$\\n\\n2.  平方完成を行います。\\n\\n$$ \\\\left( x + \\\\frac{b}{2a} \\\\right)^2 = \\\\frac{b^2 - 4ac}{4a^2} $$\\n\\n3.  両辺の平方根を取ります。\\n\\n$$ x + \\\\frac{b}{2a} = \\\\pm \\\\frac{\\\\sqrt{b^2 - 4ac}}{2a} $$\\n\\n4.  最後に整理すると、\\n\\n$$ x = -\\\\frac{b}{2a} \\\\pm \\\\frac{\\\\sqrt{b^2 - 4ac}}{2a} $$\\n\\n**これが二次方程式の解の公式です。**"
        }
      ]
    }
    \`\`\`
    
    ---
    **注意点**:
    - **見出し（###）やリスト（1., -）を適切に使用してください**。
    - **数式は $$ で囲んで記述** し、LaTeX 記法を適用してください。
    - **コードブロックが必要な場合は言語指定を明記してください**（例：\`\`\`python）。
    - **エスケープ文字（\\n など）は必要** で、Markdown の自然な改行を使用してください。
    `.trim();

    
    // OpenAI APIを呼び出し
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `以下は学習中に私が行った質問です。これらの内容に基づいて問題を作成してください：\n\n${userQuestions.join('\n\n')}` }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });
    
    // JSON応答を解析
    const responseContent = completion.choices[0].message.content;
    let quizData;
    
    try {
      // JSON文字列を抽出
      const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        // 直接JSONとして解析するのではなく、文字列として処理
        const jsonString = jsonMatch[0];
        
        // 問題のある制御文字をエスケープ
        const cleanedJsonString = jsonString.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
        
        // 安全にJSONを解析
        try {
          quizData = JSON.parse(cleanedJsonString);
        } catch (innerError) {
          console.error('JSONの解析でエラーが発生:', innerError);
          
          // 正規表現で問題と回答を直接抽出
          const questions = [];
          const questionMatches = responseContent.matchAll(/"question":\s*"([^"]+)"/g);
          const answerMatches = responseContent.matchAll(/"answer":\s*"([^"]+)"/g);
          
          const questionArray = Array.from(questionMatches).map(m => m[1]);
          const answerArray = Array.from(answerMatches).map(m => m[1]);
          
          for (let i = 0; i < Math.min(questionArray.length, answerArray.length); i++) {
            questions.push({
              question: questionArray[i],
              answer: answerArray[i]
            });
          }
          
          if (questions.length > 0) {
            quizData = { questions };
          } else {
            throw new Error('JSONの解析に失敗し、代替抽出も失敗しました');
          }
        }
      } else {
        throw new Error('レスポンスからJSONを抽出できませんでした');
      }
    } catch (jsonError) {
      console.error('JSONの解析に失敗:', jsonError);
      console.log('受信したレスポンス:', responseContent);
      throw new Error('問題データの形式が不正です');
    }
    
    // 生成したクイズデータを返す
    res.json(quizData);
    
    // 使用状況を記録することもできます
    // await db.collection('apiUsage').add({
    //   userId,
    //   endpoint: 'generate-quiz',
    //   model: 'gpt-4-turbo',
    //   timestamp: new Date(),
    //   studyTopic
    // });
  } catch (error) {
    console.error('クイズ生成エラー:', error);
    res.status(500).json({ error: error.message || 'クイズ生成エラー' });
  }
});

module.exports = router; 