import React, { useState, useEffect } from "react";
import axios from "axios"; 
import "../assets/css/Map-tree.css";
import UserService from "../services/UserService";
import LessonCompletionService from "../services/lessonCompletionService"; 
import SectionService from "../services/SectionService";
import AchievementService from "../services/AchievementService";
import ScoreService from "../services/ScoreService";

// --- LESSON IMPORTS ---
import AtomBuilder from "../STUDENT/AtomBuilder";
import IonicBonding from "../STUDENT/IonicBonding";
import CovalentBonding from "../STUDENT/CovalentBonding";
import MoleMass from "../STUDENT/MoleMass";
import MolesToGrams from "../STUDENT/MolesToGrams";
import PercentComposition from "../STUDENT/PercentComposition";

// --- CHALLENGE IMPORTS ---
import AtomChallenge1 from "../components/Student Components/AtomChallenge1";
import AtomChallenge2 from "../components/Student Components/AtomChallenge2";
import AtomChallenge3 from "../components/Student Components/AtomChallenge3";
import IonicChallenge1 from "../components/Student Components/IonicChallenge1";
import IonicChallenge2 from "../components/Student Components/IonicChallenge2";
import IonicChallenge3 from "../components/Student Components/IonicChallenge3";
import CovalentChallenge1 from "../components/Student Components/CovalentChallenge1";
import CovalentChallenge2 from "../components/Student Components/CovalentChallenge2";
import CovalentChallenge3 from "../components/Student Components/CovalentChallenge3";
import MoleMassChallenge1 from "../components/Student Components/MoleMassChallenge1";
import MoleMassChallenge2 from "../components/Student Components/MoleMassChallenge2";
import MoleMassChallenge3 from "../components/Student Components/MoleMassChallenge3";
import MTGChallenge1 from "../components/Student Components/MTGChallenge1";
import MTGChallenge2 from "../components/Student Components/MTGChallenge2";
import MTGChallenge3 from "../components/Student Components/MTGChallenge3";
import PCChallenge1 from "../components/Student Components/PCChallenge1";
import PCChallenge2 from "../components/Student Components/PCChallenge2";
import PCChallenge3 from "../components/Student Components/PCChallenge3";

// --- ENHANCED NODE MAP WITH BETTER POSITIONING ---
const nodes = [
  // Page 1: Atomic Structure
  { id: 1, label: "The Atom", position: { top: "10%", left: "5%" }, lesson: "AtomBuilder", iconType: "atom" },
  { id: 7, label: "★", position: { top: "25%", left: "18%" }, lesson: "AtomChallenge1" },
  { id: 8, label: "★", position: { top: "40%", left: "30%" }, lesson: "AtomChallenge2" },
  { id: 9, label: "★", position: { top: "30%", left: "42%" }, lesson: "AtomChallenge3" },
  { id: 2, label: "Ionic Bonding", position: { top: "18%", left: "55%" }, lesson: "IonicBonding", iconType: "ionic" },
  { id: 10, label: "★", position: { top: "12%", left: "68%" }, lesson: "IonicChallenge1" },
  { id: 11, label: "★", position: { top: "23%", left: "79%" }, lesson: "IonicChallenge2" },
  { id: 12, label: "★", position: { top: "65%", left: "80%" }, lesson: "IonicChallenge3" },

  // Page 2: Chemical Bonding - IMPROVED ROAD DESIGN
  { id: 3, label: "Covalent Bonding", position: { top: "10%", left: "5%" }, lesson: "CovalentBonding", iconType: "covalent" },
  { id: 13, label: "★", position: { top: "25%", left: "18%" }, lesson: "CovalentChallenge1" },
  { id: 14, label: "★", position: { top: "38%", left: "30%" }, lesson: "CovalentChallenge2" },
  { id: 15, label: "★", position: { top: "50%", left: "42%" }, lesson: "CovalentChallenge3" },
  { id: 4, label: "Molar Mass", position: { top: "55%", left: "55%" }, lesson: "MoleMass", iconType: "mole" },
  { id: 16, label: "★", position: { top: "55%", left: "68%" }, lesson: "MoleMassChallenge1" },
  { id: 17, label: "★", position: { top: "30%", left: "68%" }, lesson: "MoleMassChallenge2" },
  { id: 18, label: "★", position: { top: "5%", left: "68%" }, lesson: "MoleMassChallenge3" },

  // Page 3: Quantitative Chemistry - ADDED TROPHY NODE
  { id: 5, label: "Moles to Grams", position: { top: "10%", left: "5%" }, lesson: "MolesToGrams", iconType: "conversion" },
  { id: 19, label: "★", position: { top: "25%", left: "18%" }, lesson: "MTGChallenge1" },
  { id: 20, label: "★", position: { top: "38%", left: "30%" }, lesson: "MTGChallenge2" },
  { id: 21, label: "★", position: { top: "50%", left: "42%" }, lesson: "MTGChallenge3" },
  { id: 6, label: "% Composition", position: { top: "55%", left: "55%" }, lesson: "PercentComposition", iconType: "percentage" },
  { id: 22, label: "★", position: { top: "55%", left: "68%" }, lesson: "PCChallenge1" },
  { id: 23, label: "★", position: { top: "30%", left: "68%" }, lesson: "PCChallenge2" },
  { id: 24, label: "★", position: { top: "5%", left: "68%" }, lesson: "PCChallenge3" },
  
  // Trophy node for completion
  { id: 25, label: "🏆", position: { top: "80%", left: "85%" }, lesson: null, isTrophy: true },
];

// --- PAGE CONFIGURATION ---
const PAGES = [
  { 
    title: "Atomic Structure", 
    subtitle: "Build your foundation",
    nodes: [1, 7, 8, 9, 2, 10, 11, 12],
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    path: "M 5,10 C 18,25 30,40 42,30 C 55,18 68,12 79,23 C 80,65 80,65 80,65"
  },
  { 
    title: "Chemical Bonding", 
    subtitle: "Connect and create",
    nodes: [3, 13, 14, 15, 4, 16, 17, 18],
    background: "linear-gradient(135deg, #0f3460 0%, #1a1a2e 50%, #16213e 100%)",
    path: "M 5,10 C 18,25 30,38 42,50 C 55,55 68,55 68,30 C 68,5 68,5 68,5 M 42,50 C 55,55 68,55 68,30"
  },
  { 
    title: "Quantitative Chemistry", 
    subtitle: "Measure and calculate",
    nodes: [5, 19, 20, 21, 6, 22, 23, 24, 25],
    background: "linear-gradient(135deg, #16213e 0%, #0f3460 50%, #1a1a2e 100%)",
    path: "M 5,10 C 18,25 30,38 42,50 C 55,55 68,55 68,30 C 68,5 68,5 68,5 M 42,50 C 55,55 68,55 68,30 M 68,5 L 85,80"
  }
];

// --- PREREQUISITES ---
const prerequisites = {
  1: null, 7: 1, 8: 7, 9: 8,
  2: 9, 10: 2, 11: 10, 12: 11,
  3: 12, 13: 3, 14: 13, 15: 14,
  4: 15, 16: 4, 17: 16, 18: 17,
  5: 18, 19: 5, 20: 19, 21: 20,
  6: 21, 22: 6, 23: 22, 24: 23,
  25: 24,
};

// --- BACKEND TO NODE MAP ---
const backendToNodeMap = {
  1: 1, 2: 7, 3: 8, 4: 9,
  5: 2, 6: 10, 7: 11, 8: 12,
  9: 3, 10: 13, 11: 14, 12: 15,
  13: 4, 14: 16, 15: 17, 16: 18,
  17: 5, 18: 19, 19: 20, 20: 21,
  21: 6, 22: 22, 23: 23, 24: 24,
  25: 25,
};

// --- LESSON COMPONENTS ---
const lessonComponents = {
  AtomBuilder, AtomChallenge1, AtomChallenge2, AtomChallenge3,
  IonicBonding, IonicChallenge1, IonicChallenge2, IonicChallenge3,
  CovalentBonding, CovalentChallenge1, CovalentChallenge2, CovalentChallenge3,
  MoleMass, MoleMassChallenge1, MoleMassChallenge2, MoleMassChallenge3,
  MolesToGrams, MTGChallenge1, MTGChallenge2, MTGChallenge3,
  PercentComposition, PCChallenge1, PCChallenge2, PCChallenge3,
};

// --- ACHIEVEMENTS ---
const ACHIEVEMENTS = {
  FIRST_LESSON: {
    id: 'first_lesson',
    title: 'First Steps',
    description: 'Complete your first lesson',
    icon: '📚',
    condition: (completedNodes) => completedNodes.size >= 1
  },
  FIRST_CHALLENGE: {
    id: 'first_challenge',
    title: 'Challenge Accepted',
    description: 'Complete your first challenge',
    icon: '⭐',
    condition: (completedNodes) => {
      const challenges = nodes.filter(n => n.label.includes("★"));
      return challenges.some(c => completedNodes.has(c.id));
    }
  },
  THREE_CHALLENGES: {
    id: 'three_challenges',
    title: 'Hat Trick',
    description: 'Complete 3 challenges',
    icon: '🎯',
    condition: (completedNodes) => {
      const challenges = nodes.filter(n => n.label.includes("★"));
      return challenges.filter(c => completedNodes.has(c.id)).length >= 3;
    }
  },
  ATOMIC_MASTER: {
    id: 'atomic_master',
    title: 'Atomic Master',
    description: 'Complete all Atom lessons',
    icon: '⚛️',
    condition: (completedNodes) => {
      const atomNodes = [1, 7, 8, 9];
      return atomNodes.every(id => completedNodes.has(id));
    }
  },
  SCORE_500: {
    id: 'score_500',
    title: 'Rising Star',
    description: 'Earn 500 points',
    icon: '🌟',
    condition: (completedNodes, totalScore) => totalScore >= 500
  },
  SCORE_1000: {
    id: 'score_1000',
    title: 'High Achiever',
    description: 'Earn 1000 points',
    icon: '🏆',
    condition: (completedNodes, totalScore) => totalScore >= 1000
  },
  PERFECT_SCORE: {
    id: 'perfect_score',
    title: 'Perfect Score',
    description: 'Earn maximum points (1800)',
    icon: '👑',
    condition: (completedNodes, totalScore) => totalScore >= 1800
  },
  ALL_COMPLETE: {
    id: 'all_complete',
    title: 'Chemistry Champion',
    description: 'Complete all lessons',
    icon: '🎓',
    condition: (completedNodes) => completedNodes.size === nodes.length
  }
};

// --- SECTION MODAL ---
const SectionLockModal = ({ userId, onJoinSuccess }) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!userId) {
      setError("User ID missing. Please refresh.");
      setLoading(false);
      return;
    }

    try {
      await SectionService.joinSection(code, userId);
      onJoinSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Invalid section code. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="map-section-modal-overlay">
      <div className="map-section-modal-content">
        <div className="map-section-modal-icon">🔒</div>
        <h2 className="map-section-modal-title">Learning Map Locked</h2>
        <p className="map-section-modal-text">
          Join your class section to unlock the interactive learning journey
        </p>
        <form onSubmit={handleSubmit} className="map-section-modal-form">
          <input 
            type="text" 
            className="map-section-modal-input"
            placeholder="Enter Section Code" 
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            maxLength={6}
          />
          {error && <div className="map-section-modal-error">{error}</div>}
          <button type="submit" className="map-section-modal-btn" disabled={loading}>
            {loading ? "Verifying..." : "Unlock Learning Map"}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- STAR COMPONENT ---
const StarWithOrbit = ({ isCompleted, isLocked }) => {
  return (
    <div className={`star-orbit-container ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}`}>
      <div className="star-orbit">
        <div className="star-core"></div>
        <div className="star-glow"></div>
        <div className="star-particle particle-1"></div>
        <div className="star-particle particle-2"></div>
        <div className="star-particle particle-3"></div>
      </div>
    </div>
  );
};

// --- LESSON ICON ---
const LessonIcon = ({ iconType, isCompleted, isLocked }) => {
  const getIconContent = () => {
    const baseClass = `lesson-icon ${iconType} ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}`;
    
    switch (iconType) {
      case 'atom':
        return (
          <div className={baseClass}>
            <div className="atom-nucleus"></div>
            <div className="atom-orbit orbit-1"></div>
            <div className="atom-orbit orbit-2"></div>
            <div className="atom-electron electron-1"></div>
            <div className="atom-electron electron-2"></div>
            <div className="atom-electron electron-3"></div>
          </div>
        );
      
      case 'ionic':
        return (
          <div className={baseClass}>
            <div className="ionic-positive"></div>
            <div className="ionic-negative"></div>
            <div className="ionic-bond"></div>
            <div className="ionic-spark spark-1"></div>
            <div className="ionic-spark spark-2"></div>
          </div>
        );
      
      case 'covalent':
        return (
          <div className={baseClass}>
            <div className="covalent-center"></div>
            <div className="covalent-bond bond-1"></div>
            <div className="covalent-bond bond-2"></div>
            <div className="covalent-bond bond-3"></div>
            <div className="covalent-bond bond-4"></div>
            <div className="covalent-orbital"></div>
          </div>
        );
      
      case 'mole':
        return (
          <div className={baseClass}>
            <div className="mole-container">
              <div className="mole-flask"></div>
              <div className="mole-liquid"></div>
              <div className="mole-bubble bubble-1"></div>
              <div className="mole-bubble bubble-2"></div>
              <div className="mole-bubble bubble-3"></div>
            </div>
          </div>
        );
      
      case 'conversion':
        return (
          <div className={baseClass}>
            <div className="conversion-arrow"></div>
            <div className="conversion-from">M</div>
            <div className="conversion-to">G</div>
            <div className="conversion-glow"></div>
          </div>
        );
      
      case 'percentage':
        return (
          <div className={baseClass}>
            <div className="percentage-symbol">%</div>
            <div className="percentage-chart"></div>
            <div className="percentage-slice slice-1"></div>
            <div className="percentage-slice slice-2"></div>
            <div className="percentage-slice slice-3"></div>
          </div>
        );
      
      default:
        return <div className="lesson-icon default-icon">●</div>;
    }
  };

  return getIconContent();
};

// --- MAIN COMPONENT ---
export default function MapTree() {
  const [completedNodes, setCompletedNodes] = useState(new Set());
  const [activeLesson, setActiveLesson] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [totalScore, setTotalScore] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [earnedAchievements, setEarnedAchievements] = useState(new Set());
  const [newAchievement, setNewAchievement] = useState(null);

  // Load user achievements
  const loadAchievements = async (userId) => {
    try {
      const achievements = await AchievementService.getAchievementsByUser(userId);
      const earned = new Set(achievements.map(a => a.achievementId || a.id));
      setEarnedAchievements(earned);
      console.log(`🏆 Loaded ${earned.size} achievements`);
    } catch (error) {
      console.error("Failed to load achievements:", error);
    }
  };

  // Check for new achievements
  const checkAchievements = async (completedNodes, totalScore) => {
    if (!currentUser?.userId) return;

    const newlyEarned = [];

    for (const [key, achievement] of Object.entries(ACHIEVEMENTS)) {
      if (earnedAchievements.has(achievement.id)) continue;

      if (achievement.condition(completedNodes, totalScore)) {
        newlyEarned.push(achievement);
        
        try {
          await AchievementService.createAchievement(currentUser.userId, {
            title: achievement.title,
            description: achievement.description,
            codeName: achievement.id
          });
          
          console.log(`🏆 Achievement Unlocked: ${achievement.title}`);
        } catch (error) {
          console.error(`Failed to save achievement ${achievement.id}:`, error);
        }
      }
    }

    if (newlyEarned.length > 0) {
      setEarnedAchievements(prev => {
        const updated = new Set(prev);
        newlyEarned.forEach(a => updated.add(a.id));
        return updated;
      });
      
      setNewAchievement(newlyEarned[0]);
      setTimeout(() => setNewAchievement(null), 5000);
    }
  };

  const loadUserProgress = async (userId) => {
    try {
      const completions = await LessonCompletionService.getUserCompletions(userId);
      console.log("--- START DEBUG: LOADED COMPLETIONS ---");
      console.log("Raw Server Data:", completions);
      console.log("--- END DEBUG ---");

      const completedIds = new Set();
      (completions || []).forEach(c => {

        let mappedId = null;

        const possibleKeys = [c.lessonId, c.lesson?.id, c.lesson?.lessonId, c.completionId];
        for (const key of possibleKeys) {
          if (key != null && backendToNodeMap[key]) {
            mappedId = backendToNodeMap[key];
            break;
          }
        }

        if (mappedId == null) {
          const lessonName = c.lesson?.name || c.lessonName || c.name || c.title || c.label || c.lessonCode;
          if (lessonName) {
            const nodeMatch = nodes.find(n => n.lesson && n.lesson.toLowerCase() === String(lessonName).toLowerCase());
            if (nodeMatch) mappedId = nodeMatch.id;
            else {
              const looseMatch = nodes.find(n => n.lesson && String(lessonName).toLowerCase().includes(n.lesson.toLowerCase()));
              if (looseMatch) mappedId = looseMatch.id;
            }
          }
        }

        if (mappedId != null) {
          completedIds.add(mappedId);
        }
      });

      setCompletedNodes(completedIds);
      
      const challengeNodes = nodes.filter(n => n.label.includes("★"));
      const completedChallenges = challengeNodes.filter(n => completedIds.has(n.id));
      const calculatedScore = completedChallenges.length * 100;
      
      setTotalScore(calculatedScore);
      
      if (currentUser?.userId) {
        await syncScore(completedIds, currentUser.userId);
      }
      
      await checkAchievements(completedIds, calculatedScore);
      
    } catch (err) {
      console.warn("Could not load user completions on login.", err.response?.data || err.message);
      setCompletedNodes(new Set());
      setTotalScore(0);
    }
  };
  
  const syncScore = async (completedNodes, userId) => {
    try {
      const challengeNodes = nodes.filter(n => n.label.includes("★"));
      const completedChallenges = challengeNodes.filter(n => completedNodes.has(n.id));
      const expectedScore = completedChallenges.length * 100;

      try {
        const currentScore = await ScoreService.getScore(userId);

        if (currentScore.careerScore !== expectedScore) {
          const difference = expectedScore - currentScore.careerScore;
          if (difference > 0) {
            await ScoreService.addChallengeScore(userId, difference);
          }
        }
      } catch (error) {
        if (error.response?.status === 404 || error.message?.includes("not found")) {
          await ScoreService.createScore(userId);
          if (expectedScore > 0) {
            await ScoreService.addChallengeScore(userId, expectedScore);
          }
        }
      }
    } catch (error) {
      console.error("Failed to sync score:", error);
    }
  };

  useEffect(() => {
    const initData = async () => {
      try {
        let userData = await UserService.getCurrentUser();
        setCurrentUser(userData);

        if (userData.role === "STUDENT" && !userData.student) {
          try {
            // FIXED: Use localStorage token instead of sessionStorage 'user' object
            const token = localStorage.getItem("token");
            await axios.post("http://localhost:8080/api/student/add", {
              firstName: userData.firstName,
              lastName: userData.lastName,
              user: { userId: userData.userId || userData.id } 
            }, { 
              headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } 
            });
            userData = await UserService.getCurrentUser();
            setCurrentUser(userData);
          } catch (e) { console.warn("Auto-create failed", e); }
        }

        if (userData.student && userData.student.section) {
          setHasAccess(true);
          const validUserId = userData.userId || userData.id;
          if (validUserId) await loadUserProgress(validUserId);
        } else {
          setHasAccess(false);
        }
      } catch (err) {
        setHasAccess(false);
      } finally {
        setCheckingAccess(false);
      }
    };

    initData();
  }, []);

  const isPrerequisiteChainComplete = (nodeId) => {
    let currentId = nodeId;
    while (currentId !== null && currentId !== undefined) {
      const prereq = prerequisites[currentId];
      if (prereq === null || prereq === undefined) {
        return true;
      }
      if (!completedNodes.has(prereq)) {
        return false;
      }
      currentId = prereq;
    }
    return true;
  };

  const handleNodeClick = (node, isLocked) => {
    if (!hasAccess) return;
    if (isLocked) return alert("Please complete the previous lesson first.");
    if (node.isTrophy) {
      alert("🎉 Congratulations! You've completed all lessons and challenges! 🎉");
      return;
    }
    if (node.lesson) setActiveLesson(node);
  };

  const handleLessonComplete = async () => {
    if (activeLesson && currentUser) {
      try {
        // 1. Get the User ID securely
        const userId = currentUser.userId || currentUser.id;
        
        if (!userId) {
          console.error("Missing User ID");
          return;
        }

        const lessonId = Object.keys(backendToNodeMap).find(
          key => backendToNodeMap[key] === activeLesson.id
        );

        if (!lessonId) return;

        console.log(`Saving completion for lesson ID: ${lessonId}, Node ID: ${activeLesson.id}`);
        await LessonCompletionService.completeLesson(userId, parseInt(lessonId));
        
        // 3. Update scores if it's a challenge
        if (activeLesson.label.includes("★")) {
          try {
            await ScoreService.addChallengeScore(userId, 100);
          } catch (error) {
            console.error("Failed to update score:", error);
          }
        }
        
        // 4. Reload progress
        await loadUserProgress(userId);
      } catch (err) {
        // Handle "already completed" gracefully
        if (err.message?.includes("Lesson already completed") || err.response?.status === 409) {
            const userId = currentUser.userId || currentUser.id;
            await loadUserProgress(userId);
        } else {
          console.error("Failed to save progress:", err);
        }
      }
    }
    setActiveLesson(null);
  };

  const CurrentLessonComponent = activeLesson ? lessonComponents[activeLesson.lesson] : null;
  const currentPageData = PAGES[currentPage];

  if (checkingAccess) return <div className="map-loading-container"><div className="map-loading-text">Loading Learning Journey...</div></div>;

  return (
    <div className="map-container">
      {!hasAccess && (
        <SectionLockModal
          userId={currentUser?.userId || currentUser?.id}
          onJoinSuccess={async () => {
            setHasAccess(true);
            const updatedUser = await UserService.getCurrentUser();
            setCurrentUser(updatedUser);
            const validUserId = updatedUser.userId || updatedUser.id;
            await loadUserProgress(validUserId);
          }}
        />
      )}
      
      {/* SCORE DISPLAY BANNER */}
      {hasAccess && (
        <div className="map-score-banner">
          <div className="map-score-display">
            <div className="map-score-main">
              <span className="map-score-label">Learning Score:</span>
              <span className="map-score-value">{totalScore}</span>
            </div>
            <div className="map-score-details">
              <span className="map-score-stars">
                ★ {totalScore / 100} / {nodes.filter(n => n.label.includes("★")).length} Challenges
              </span>
              <span className="map-page-indicator">
                Page {currentPage + 1} of {PAGES.length}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Achievement Notification Popup */}
      {newAchievement && (
        <div className="achievement-notification">
          <div className="achievement-content">
            <div className="achievement-icon">{newAchievement.icon}</div>
            <div className="achievement-text">
              <div className="achievement-badge">Achievement Unlocked!</div>
              <div className="achievement-title">{newAchievement.title}</div>
              <div className="achievement-description">{newAchievement.description}</div>
            </div>
          </div>
        </div>
      )}

      {!activeLesson && hasAccess && (
        <div className="map-content-wrapper">
          {/* PAGE HEADER */}
          <div className="map-page-header">
            <h1 className="map-page-title">{currentPageData.title}</h1>
            <p className="map-page-subtitle">{currentPageData.subtitle}</p>
          </div>

          {/* NODE CONTAINER */}
          <div className="map-node-container" style={{ background: currentPageData.background }}>
            <svg className="map-progress-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path 
                d={currentPageData.path}
                className="map-progress-path"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1.5"
                strokeDasharray="8,4"
              />
            </svg>

            {currentPageData.nodes.map(nodeId => {
              const node = nodes.find(n => n.id === nodeId);
              if (!node) return null;
              
              const isCompleted = completedNodes.has(node.id);
              const isLocked = !isPrerequisiteChainComplete(node.id);
              const status = isCompleted ? "completed" : isLocked ? "locked" : "unlocked";

              return (
                <div
                  key={node.id}
                  className={`map-node map-node-${status}`}
                  data-type={node.isTrophy ? "trophy" : (node.label.includes("★") ? "challenge" : "lesson")}
                  style={{ top: node.position.top, left: node.position.left }}
                  onClick={() => handleNodeClick(node, isLocked)}
                >
                  <div className="map-node-content">
                    {node.isTrophy ? (
                      <div className="map-trophy-icon">🏆</div>
                    ) : node.label.includes("★") ? (
                      <StarWithOrbit isCompleted={isCompleted} isLocked={isLocked} />
                    ) : (
                      <LessonIcon 
                        iconType={node.iconType} 
                        isCompleted={isCompleted} 
                        isLocked={isLocked} 
                      />
                    )}
                    <span className="map-node-label">{node.label.replace("★", "").replace("🏆", "")}</span>
                  </div>
                  {isCompleted && <div className="map-completion-badge">✓</div>}
                  {isLocked && <div className="map-locked-overlay">🔒</div>}
                </div>
              );
            })}
          </div>

          {/* PAGE NAVIGATION */}
          <div className="map-navigation">
            <button 
              className="map-nav-btn map-nav-prev"
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
            >
              ← Previous
            </button>
            
            <div className="map-page-dots">
              {PAGES.map((_, index) => (
                <button
                  key={index}
                  className={`map-page-dot ${currentPage === index ? 'active' : ''}`}
                  onClick={() => setCurrentPage(index)}
                />
              ))}
            </div>
            
            <button 
              className="map-nav-btn map-nav-next"
              onClick={() => setCurrentPage(prev => Math.min(PAGES.length - 1, prev + 1))}
              disabled={currentPage === PAGES.length - 1}
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* LESSON MODAL */}
      {activeLesson && CurrentLessonComponent && hasAccess && (
        <div className="map-lesson-modal">
          <div className="map-lesson-inner">
            <div className="map-lesson-header">
              <button className="map-close-btn" onClick={() => setActiveLesson(null)}>✕</button>
            </div>
            <div className="map-lesson-body">
              <CurrentLessonComponent onComplete={handleLessonComplete} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}