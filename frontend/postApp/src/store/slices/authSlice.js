// slices/authSlice.js
export const createAuthSlice = (set) => ({
    userInfo: null, // Initial state
    setuserInfo: (user) => {
      console.log("Setting userInfo in Zustand:", user); // Debug userInfo data
      set({ userInfo: user });
    },
  });
  