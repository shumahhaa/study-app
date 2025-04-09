import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import { useStudy } from "../../contexts/StudyContext";

// Pages
import HomePage from "../../pages/HomePage";
import HistoryPage from "../../pages/HistoryPage";
import ActiveStudyPage from "../../pages/ActiveStudyPage";
import CompletedStudyPage from "../../pages/CompletedStudyPage";
import AnalyticsPage from "../../pages/AnalyticsPage";
import CalendarPage from "../../pages/CalendarPage";
import ReviewQuizzesPage from "../../pages/ReviewQuizzesPage";
import LoginPage from "../../pages/LoginPage";
import RegisterPage from "../../pages/RegisterPage";
import ResetPasswordPage from "../../pages/ResetPasswordPage";
import ProfilePage from "../../pages/ProfilePage";

const AppRouter = () => {
  const {
    studyTopic,
    setStudyTopic,
    motivation,
    setMotivation,
    isStudying,
    isPaused,
    pauseStudy,
    resumeStudy,
    startStudy,
    stopStudy,
    abandonStudy,
    studyDuration,
    studyStartTime,
    pausedTime,
    recordedStudyTopic,
    recordedMotivation,
    studyHistory,
    formatTime,
    getStatus,
    deleteStudySession,
    resetChatHistory,
  } = useStudy();

  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* 認証が必要なルート */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <HomePage
                  studyTopic={studyTopic}
                  setStudyTopic={setStudyTopic}
                  motivation={motivation}
                  setMotivation={setMotivation}
                  isStudying={isStudying}
                  isPaused={isPaused}
                  pauseStudy={pauseStudy}
                  resumeStudy={resumeStudy}
                  startStudy={startStudy}
                  stopStudy={stopStudy}
                  abandonStudy={abandonStudy}
                  studyDuration={studyDuration}
                  recordedStudyTopic={recordedStudyTopic}
                  recordedMotivation={recordedMotivation}
                  formatTime={formatTime}
                  getStatus={getStatus}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage isStudying={isStudying} />
              </PrivateRoute>
            }
          />
          <Route
            path="/active"
            element={
              <PrivateRoute>
                <ActiveStudyPage
                  recordedStudyTopic={recordedStudyTopic}
                  studyDuration={studyDuration}
                  formatTime={formatTime}
                  isPaused={isPaused}
                  pauseStudy={pauseStudy}
                  resumeStudy={resumeStudy}
                  stopStudy={stopStudy}
                  abandonStudy={abandonStudy}
                  recordedMotivation={recordedMotivation}
                  isStudying={isStudying}
                  resetChatHistory={resetChatHistory}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/completed"
            element={
              <PrivateRoute>
                <CompletedStudyPage
                  recordedStudyTopic={recordedStudyTopic}
                  studyDuration={studyDuration}
                  formatTime={formatTime}
                  recordedMotivation={recordedMotivation}
                  studyStartTime={studyStartTime}
                  pausedTime={pausedTime}
                  resetChatHistory={resetChatHistory}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/history"
            element={
              <PrivateRoute>
                <HistoryPage
                  studyHistory={studyHistory}
                  formatTime={formatTime}
                  deleteStudySession={deleteStudySession}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <PrivateRoute>
                <AnalyticsPage
                  studyHistory={studyHistory}
                  formatTime={formatTime}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <PrivateRoute>
                <CalendarPage
                  studyHistory={studyHistory}
                  formatTime={formatTime}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/review-quizzes"
            element={
              <PrivateRoute>
                <ReviewQuizzesPage
                  formatTime={formatTime}
                />
              </PrivateRoute>
            }
          />
          
          {/* 認証が不要なルート */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default AppRouter; 