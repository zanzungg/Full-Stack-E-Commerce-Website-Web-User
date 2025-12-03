import { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../api/services/authService';
import { userService } from '../api/services/userService';
import { STORAGE_KEYS } from '../config/constants';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [authLoading, setAuthLoading] = useState(false);

    // Khôi phục trạng thái khi load trang
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
            
            if (token) {
                // Fetch user profile từ API
                try {
                    const response = await userService.getProfile();
                    const userData = response.data;
                    
                    setUser(userData);
                    setIsAuthenticated(true);
                    localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(userData));
                } catch (error) {
                    console.error('Failed to fetch user profile:', error);
                    // Nếu token hết hạn hoặc invalid, logout
                    logout();
                }
            }
        } catch (error) {
            console.error('Check auth error:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            setAuthLoading(true);
            
            const response = await authService.login(credentials);
            
            const accessToken = response.data?.accessToken;
            const refreshToken = response.data?.refreshToken;
            
            if (!accessToken) {
                throw new Error('No access token received from server');
            }
            
            // Save tokens
            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
            if (refreshToken) {
                localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
            }
            
            // Fetch user profile
            const profileResponse = await userService.getProfile();
            const userData = profileResponse.data;
            
            localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(userData));
            setUser(userData);
            setIsAuthenticated(true);
            
            return response;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally {
            setAuthLoading(false);
        }
    };

    const register = async (userData) => {
        try {
            setAuthLoading(true);
            const response = await authService.register(userData);
            return response;
        } catch (error) {
            console.error('Register error:', error);
            throw error;
        } finally {
            setAuthLoading(false);
        }
    };

    const verifyEmail = async (email, otp) => {
        try {
            setAuthLoading(true);
            const response = await authService.verifyEmail({ email, otp });
            return response;
        } catch (error) {
            console.error('Verify email error:', error);
            throw error;
        } finally {
            setAuthLoading(false);
        }
    };

    const logout = async () => {
        try {
            setAuthLoading(true);
            
            // Gọi API logout để invalidate token trên server
            await authService.logout();
            
            console.log('Logged out successfully from server');
        } catch (error) {
            console.error('Logout API error:', error);
            // Vẫn tiếp tục logout ở client ngay cả khi API thất bại
        } finally {
            // Clear tất cả dữ liệu local
            localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER_INFO);
            localStorage.removeItem(STORAGE_KEYS.CART_ITEMS);
            localStorage.removeItem(STORAGE_KEYS.RESET_TOKEN);
            
            // Reset state
            setUser(null);
            setIsAuthenticated(false);
            setAuthLoading(false);
        }
    };

    const forgotPassword = async (email) => {
        try {
            setAuthLoading(true);
            const response = await authService.forgotPassword(email);
            return response;
        } catch (error) {
            console.error('Forgot password error:', error);
            throw error;
        } finally {
            setAuthLoading(false);
        }
    };

    const verifyResetCode = async (email, otp) => {
        try {
            setAuthLoading(true);
            const response = await authService.verifyResetCode({ email, otp });
            
            // Lưu resetToken vào localStorage
            if (response.resetToken) {
                localStorage.setItem(STORAGE_KEYS.RESET_TOKEN, response.resetToken);
            }
            
            return response;
        } catch (error) {
            console.error('Verify reset code error:', error);
            throw error;
        } finally {
            setAuthLoading(false);
        }
    };

    const resetPassword = async (resetToken, newPassword) => {
        try {
            setAuthLoading(true);
            const response = await authService.resetPassword({ 
                resetToken, 
                newPassword 
            });
            
            // Clear resetToken sau khi thành công
            localStorage.removeItem(STORAGE_KEYS.RESET_TOKEN);
            
            return response;
        } catch (error) {
            console.error('Reset password error:', error);
            throw error;
        } finally {
            setAuthLoading(false);
        }
    };

    const updateUser = (updatedUserInfo) => {
        setUser(updatedUserInfo);
        localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(updatedUserInfo));
    };

    const refreshUserProfile = async () => {
        try {
            const response = await userService.getProfile();
            const userData = response.data;
            updateUser(userData);
            return userData;
        } catch (error) {
            console.error('Refresh profile error:', error);
            throw error;
        }
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        authLoading,
        login,
        register,
        verifyEmail,
        logout,
        forgotPassword,
        verifyResetCode,
        resetPassword,
        checkAuth,
        updateUser,
        refreshUserProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook để sử dụng AuthContext
export const useAuthContext = () => {
    const context = useContext(AuthContext);
    
    if (!context) {
        throw new Error('useAuthContext must be used within AuthProvider');
    }
    
    return context;
};