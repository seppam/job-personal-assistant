// Auth facade: real Clerk components normally, harmless stubs in offline demo mode.
import React from 'react';
import * as Clerk from '@clerk/clerk-react';
import { isDemo, demoUser } from './demo/demo';

export const ClerkProvider = isDemo ? ({ children }) => <>{children}</> : Clerk.ClerkProvider;
export const SignedIn = isDemo ? ({ children }) => <>{children}</> : Clerk.SignedIn;
export const SignedOut = isDemo ? () => null : Clerk.SignedOut;
export const SignInButton = isDemo ? () => <span>Sign in</span> : Clerk.SignInButton;
export const UserButton = isDemo
  ? () => <div className="w-7 h-7 rounded-full bg-violet-glow/30 text-violet-glow text-xs font-bold flex items-center justify-center">A</div>
  : Clerk.UserButton;
export const useUser = isDemo ? () => ({ user: demoUser }) : Clerk.useUser;
export const useAuth = isDemo ? () => ({ userId: demoUser.id }) : Clerk.useAuth;
