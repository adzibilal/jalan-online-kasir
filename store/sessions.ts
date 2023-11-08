import create from 'zustand';

export interface SessionState {
    user: any;
    expDateTime: string;
}

const useSessionStore = create<SessionState>((set) => ({
    user: null,
    expDateTime: '',
    setSession: (user: any, expDateTime: string) =>
        set(() => ({ user, expDateTime })),
    clearSession: () => set(() => ({ user: null, expDateTime: '' })),
}));

export default useSessionStore;
