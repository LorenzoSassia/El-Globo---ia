import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { mockApi } from '../services/mockApi';

interface AuthContextType {
  user: User | null;
  login: (role: UserRole, username: string, password?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (role: UserRole, username: string, password?: string) => {
    // Mock login logic - in a real app, you'd validate username and password
    const mockUser: User = { username, role };
    
    if (role === UserRole.SOCIO) {
        // In a real app, you'd fetch the member ID based on username/pass
        // This mock user will only find data if a member with ID 1 is created by the admin.
        mockUser.memberId = 1; 
    } else if (role === UserRole.COBRADOR) {
        // Simulate fetching collector details
        const collector = await mockApi.getCollectorByName(username);
        if (collector) {
            mockUser.collectorId = collector.id;
            mockUser.zone = collector.zone;
        } else {
            // Fallback for simulation if name doesn't match
            const collectors = await mockApi.getCollectors();
            if (collectors.length > 0) {
                 mockUser.collectorId = collectors[0].id;
                 mockUser.zone = collectors[0].zone;
            }
        }
    }
    
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};