import api from "../configs/api/axios";

/**
 * Fetch all available achievements
 */
export const fetchAchievements = async (token) => {
  return await api.get("/achievements", {
    headers: { Authorization: token },
  });
};

/**
 * Fetch specific achievement by ID
 */
export const fetchAchievementById = async (id, token) => {
  return await api.get(`/achievements/${id}`, {
    headers: { Authorization: token },
  });
};

/**
 * Fetch achievements by category
 */
export const fetchAchievementsByCategory = async (category, token) => {
  return await api.get(`/achievements/categories/${category}`, {
    headers: { Authorization: token },
  });
};

/**
 * Fetch all categories
 */
export const fetchAchievementCategories = async (token) => {
  return await api.get("/achievements/categories", {
    headers: { Authorization: token },
  });
};

/**
 * Fetch public achievements only
 */
export const fetchPublicAchievements = async () => {
  return await api.get("/achievements/public");
};

/**
 * Fetch user's achievement progress
 */
export const fetchUserAchievementProgress = async (userId, token) => {
  return await api.get(`/achievements/user/${userId}/progress`, {
    headers: { Authorization: token },
  });
};

/**
 * Trigger achievement detection for user
 */
export const checkUserAchievements = async (userId, token) => {
  return await api.post(`/achievements/user/${userId}/check`, {}, {
    headers: { Authorization: token },
  });
};

/**
 * Get user's earned achievements
 */
export const fetchUserAchievements = async (userId, token) => {
  return await api.get(`/user-achievements/${userId}`, {
    headers: { Authorization: token },
  });
};

/**
 * Award achievement to user
 */
export const awardAchievement = async (userId, achievementId, token) => {
  return await api.post("/user-achievements", 
    { userId, achievementId }, 
    { headers: { Authorization: token } }
  );
};

/**
 * Remove achievement from user (admin only)
 */
export const removeUserAchievement = async (userAchievementId, token) => {
  return await api.delete(`/user-achievements/${userAchievementId}`, {
    headers: { Authorization: token },
  });
};

// ADMIN FUNCTIONS
/**
 * Create new achievement (admin only)
 */
export const createAchievement = async (achievementData, token) => {
  return await api.post("/achievements", achievementData, {
    headers: { Authorization: token },
  });
};

/**
 * Update achievement (admin only)
 */
export const updateAchievement = async (id, achievementData, token) => {
  return await api.put(`/achievements/${id}`, achievementData, {
    headers: { Authorization: token },
  });
};

/**
 * Delete achievement (admin only)
 */
export const deleteAchievement = async (id, token) => {
  return await api.delete(`/achievements/${id}`, {
    headers: { Authorization: token },
  });
};
