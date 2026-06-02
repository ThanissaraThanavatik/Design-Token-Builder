import { create } from 'zustand';
import type { Collection, Token, TokenMode, TokenValue } from '@/types/token';
import { BREAKPOINT_MODES } from '@/types/token';
import { useBrandStore } from './brandStore';

type CollectionSnapshot = Collection[];

interface TokenStore {
  selectedCollectionId: string | null;
  selectedTokenId: string | null;
  history: CollectionSnapshot[];
  historyIndex: number;

  selectCollection: (id: string | null) => void;
  selectToken: (id: string | null) => void;

  addToken: (collectionId: string, token: Omit<Token, 'id'> & { id: string }) => void;
  addTokensBatch: (collectionId: string, tokens: Array<Omit<Token, 'id'> & { id: string }>) => void;
  updateTokenValue: (collectionId: string, tokenId: string, mode: TokenMode, value: string) => void;
  updateTokenName: (collectionId: string, tokenId: string, newName: string, newCssVar: string) => void;
  updateTokenField: (collectionId: string, tokenId: string, field: Partial<Token>) => void;
  deleteToken: (collectionId: string, tokenId: string) => void;
  duplicateToken: (collectionId: string, tokenId: string) => void;
  bulkRenamePrefix: (collectionId: string, oldPrefix: string, newPrefix: string) => void;
  renameGroup: (collectionId: string, oldName: string, newName: string) => void;
  deleteGroup: (collectionId: string, groupName: string) => void;
  setCollectionModes: (collectionId: string, modes: TokenMode[]) => void;
  undo: () => void;
  redo: () => void;
}

function getCollections(): Collection[] {
  const { brands, activeBrandId } = useBrandStore.getState();
  return brands.find((b) => b.id === activeBrandId)?.collections ?? [];
}

function pushCollections(collections: Collection[]) {
  useBrandStore.getState().updateBrandCollections(
    useBrandStore.getState().activeBrandId,
    collections,
  );
}

const HISTORY_LIMIT = 50;

export const useTokenStore = create<TokenStore>((set, get) => ({
  selectedCollectionId: null,
  selectedTokenId: null,
  history: [],
  historyIndex: -1,

  selectCollection: (id) => set({ selectedCollectionId: id, selectedTokenId: null }),
  selectToken: (id) => set({ selectedTokenId: id }),

  addToken: (collectionId, token) => {
    const collections = getCollections();
    const next = collections.map((c) =>
      c.id === collectionId ? { ...c, tokens: [...c.tokens, token] } : c,
    );
    _pushHistory(get, set, next);
    pushCollections(next);
  },

  addTokensBatch: (collectionId, tokens) => {
    const collections = getCollections();
    const next = collections.map((c) =>
      c.id === collectionId ? { ...c, tokens: [...c.tokens, ...tokens] } : c,
    );
    _pushHistory(get, set, next);
    pushCollections(next);
  },

  updateTokenValue: (collectionId, tokenId, mode, value) => {
    const collections = getCollections();
    const next = collections.map((c) => {
      if (c.id !== collectionId) return c;
      return {
        ...c,
        tokens: c.tokens.map((t) => {
          if (t.id !== tokenId) return t;
          const newVal: TokenValue = { raw: value };
          return { ...t, values: { ...t.values, [mode]: newVal } };
        }),
      };
    });
    _pushHistory(get, set, next);
    pushCollections(next);
  },

  updateTokenName: (collectionId, tokenId, newName, newCssVar) => {
    const collections = getCollections();
    const next = collections.map((c) => {
      if (c.id !== collectionId) return c;
      return {
        ...c,
        tokens: c.tokens.map((t) =>
          t.id === tokenId ? { ...t, name: newName, cssVariable: newCssVar } : t,
        ),
      };
    });
    _pushHistory(get, set, next);
    pushCollections(next);
  },

  updateTokenField: (collectionId, tokenId, field) => {
    const collections = getCollections();
    const next = collections.map((c) => {
      if (c.id !== collectionId) return c;
      return {
        ...c,
        tokens: c.tokens.map((t) => (t.id === tokenId ? { ...t, ...field } : t)),
      };
    });
    _pushHistory(get, set, next);
    pushCollections(next);
  },

  deleteToken: (collectionId, tokenId) => {
    const collections = getCollections();
    const next = collections.map((c) =>
      c.id === collectionId ? { ...c, tokens: c.tokens.filter((t) => t.id !== tokenId) } : c,
    );
    _pushHistory(get, set, next);
    pushCollections(next);
  },

  duplicateToken: (collectionId, tokenId) => {
    const collections = getCollections();
    const next = collections.map((c) => {
      if (c.id !== collectionId) return c;
      const idx = c.tokens.findIndex((t) => t.id === tokenId);
      if (idx === -1) return c;
      const original = c.tokens[idx];
      const copy: Token = {
        ...structuredClone(original),
        id: `${original.id}-copy-${Date.now()}`,
        name: `${original.name}-copy`,
        cssVariable: `${original.cssVariable}-copy`,
      };
      const tokens = [...c.tokens];
      tokens.splice(idx + 1, 0, copy);
      return { ...c, tokens };
    });
    _pushHistory(get, set, next);
    pushCollections(next);
  },

  bulkRenamePrefix: (collectionId, oldPrefix, newPrefix) => {
    const collections = getCollections();
    const next = collections.map((c) => {
      if (c.id !== collectionId) return c;
      return {
        ...c,
        tokens: c.tokens.map((t) => ({
          ...t,
          cssVariable: t.cssVariable.startsWith(oldPrefix)
            ? newPrefix + t.cssVariable.slice(oldPrefix.length)
            : t.cssVariable,
        })),
      };
    });
    _pushHistory(get, set, next);
    pushCollections(next);
  },

  renameGroup: (collectionId, oldName, newName) => {
    const collections = getCollections();
    const next = collections.map((c) => {
      if (c.id !== collectionId) return c;
      return {
        ...c,
        tokens: c.tokens.map((t) =>
          t.group === oldName ? { ...t, group: newName } : t,
        ),
      };
    });
    _pushHistory(get, set, next);
    pushCollections(next);
  },

  deleteGroup: (collectionId, groupName) => {
    const collections = getCollections();
    const next = collections.map((c) =>
      c.id === collectionId
        ? { ...c, tokens: c.tokens.filter((t) => t.group !== groupName) }
        : c,
    );
    _pushHistory(get, set, next);
    pushCollections(next);
  },

  setCollectionModes: (collectionId, modes) => {
    const collections = getCollections();
    const removedBpModes = BREAKPOINT_MODES.filter((m) => !modes.includes(m));
    const next = collections.map((c) => {
      if (c.id !== collectionId) return c;
      const tokens = removedBpModes.length > 0
        ? c.tokens.map((t) => {
            const values = { ...t.values };
            for (const m of removedBpModes) delete (values as Record<string, unknown>)[m];
            return { ...t, values };
          })
        : c.tokens;
      return { ...c, modes, tokens };
    });
    _pushHistory(get, set, next);
    pushCollections(next);
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    set({ historyIndex: newIndex });
    pushCollections(history[newIndex]);
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    set({ historyIndex: newIndex });
    pushCollections(history[newIndex]);
  },
}));

function _pushHistory(
  get: () => TokenStore,
  set: (fn: Partial<TokenStore> | ((s: TokenStore) => Partial<TokenStore>)) => void,
  snapshot: Collection[],
) {
  const { history, historyIndex } = get();
  const trimmed = history.slice(0, historyIndex + 1);
  const next = [...trimmed, snapshot].slice(-HISTORY_LIMIT);
  set({ history: next, historyIndex: next.length - 1 });
}
