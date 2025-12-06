import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  postsCount: number;
  hasProfile: boolean;
}

interface StoredUser extends User {
  password: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const currentUserId = localStorage.getItem('currentUserId');
    if (currentUserId) {
      const users = getStoredUsers();
      const foundUser = users.find(u => u.id === currentUserId);
      if (foundUser) {
        const { password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
      }
    }
  }, []);

  const register = (name: string, email: string, password: string, confirmPassword: string): { success: boolean; error?: string } => {
    if (password !== confirmPassword) {
      return { success: false, error: "Passwords don't match" };
    }

    if (password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters" };
    }

    const users = getStoredUsers();
    
    if (users.find(u => u.email === email)) {
      return { success: false, error: "Email already registered" };
    }

    const newUser: StoredUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      postsCount: 0,
      hasProfile: false
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    return { success: true };
  };

  const login = (email: string, password: string): { success: boolean; error?: string } => {
    const users = getStoredUsers();
    const foundUser = users.find(u => u.email === email && u.password === password);

    if (!foundUser) {
      return { success: false, error: "Invalid email or password" };
    }

    localStorage.setItem('currentUserId', foundUser.id);
    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);

    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('currentUserId');
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;

    const users = getStoredUsers();
    const userIndex = users.findIndex(u => u.id === user.id);
    
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      localStorage.setItem('users', JSON.stringify(users));
      
      const { password, ...userWithoutPassword } = users[userIndex];
      setUser(userWithoutPassword);
    }
  };

  return { user, login, logout, register, updateUser };
}

function getStoredUsers(): StoredUser[] {
  const stored = localStorage.getItem('users');
  return stored ? JSON.parse(stored) : [];
}
