import { create } from 'zustand';
import { UserProfile, Address } from '../types';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  addresses: Address[];
  login: (email: string, role: 'USER' | 'ADMIN', name?: string) => void;
  logout: () => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  deleteAddress: (id: string) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  setDefaultAddress: (id: string) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
}

const defaultAddresses: Address[] = [
  {
    id: 'addr-1',
    fullName: 'Jane Doe',
    phone: '+1 (555) 019-2834',
    addressLine1: '120 Stripe Way',
    addressLine2: 'Suite 400',
    city: 'San Francisco',
    state: 'CA',
    pincode: '94103',
    country: 'United States',
    isDefault: true,
  },
  {
    id: 'addr-2',
    fullName: 'Jane Doe',
    phone: '+1 (555) 019-2834',
    addressLine1: '742 Evergreen Terrace',
    city: 'Springfield',
    state: 'IL',
    pincode: '62704',
    country: 'United States',
    isDefault: false,
  }
];

export const useAuthStore = create<AuthState>((set) => ({
  user: {
    id: 'usr-default-1',
    email: 'hello@cartify.com',
    role: 'USER',
    name: 'Jane Doe',
    phone: '+1 (555) 019-2834',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&fit=crop',
  },
  isAuthenticated: true,
  addresses: defaultAddresses,
  login: (email, role, name) => set({
    user: {
      id: `usr-${Math.random().toString(36).substr(2, 9)}`,
      email,
      role,
      name: name || email.split('@')[0],
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&h=150&fit=crop',
    },
    isAuthenticated: true
  }),
  logout: () => set({ user: null, isAuthenticated: false }),
  addAddress: (address) => set((state) => {
    const id = `addr-${Math.random().toString(36).substr(2, 9)}`;
    const newAddress = { ...address, id, isDefault: state.addresses.length === 0 ? true : address.isDefault };
    let updatedAddresses = [...state.addresses];
    if (newAddress.isDefault) {
      updatedAddresses = updatedAddresses.map((a) => ({ ...a, isDefault: false }));
    }
    updatedAddresses.push(newAddress);
    return { addresses: updatedAddresses };
  }),
  deleteAddress: (id) => set((state) => {
    const remaining = state.addresses.filter((a) => a.id !== id);
    if (remaining.length > 0 && !remaining.some((a) => a.isDefault)) {
      remaining[0].isDefault = true;
    }
    return { addresses: remaining };
  }),
  updateAddress: (id, address) => set((state) => {
    let updatedAddresses = state.addresses.map((a) => (a.id === id ? { ...a, ...address } : a));
    if (address.isDefault) {
      updatedAddresses = updatedAddresses.map((a) => (a.id === id ? { ...a, isDefault: true } : { ...a, isDefault: false }));
    }
    return { addresses: updatedAddresses };
  }),
  setDefaultAddress: (id) => set((state) => ({
    addresses: state.addresses.map((a) => ({ ...a, isDefault: a.id === id }))
  })),
  updateProfile: (profile) => set((state) => {
    if (!state.user) return {};
    return {
      user: {
        ...state.user,
        ...profile
      }
    };
  })
}));
