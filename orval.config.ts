import { defineConfig } from '@orval/core';

export default defineConfig({
  content: {
    input: './docs/openapi/content.yaml',
    output: {
      target: './packages/sdk/src/content.ts',
      client: 'react-query',
      mode: 'tags-split',
      override: {
        mutator: {
          path: './packages/sdk/src/mutator.ts',
          name: 'customInstance',
        },
        query: {
          useQuery: true,
          useInfinite: false,
          // Стабильные queryKey (не зависят от порядка параметров)
          queryKey: (params) => {
            const sortedParams = Object.keys(params || {})
              .sort()
              .reduce((acc, key) => {
                acc[key] = params[key];
                return acc;
              }, {} as Record<string, unknown>);
            return JSON.stringify(sortedParams);
          },
        },
      },
    },
    types: {
      output: './packages/types/src/content.ts',
    },
  },
  auth: {
    input: './docs/openapi/auth.yaml',
    output: {
      target: './packages/sdk/src/auth.ts',
      client: 'react-query',
      mode: 'tags-split',
      override: {
        mutator: {
          path: './packages/sdk/src/mutator.ts',
          name: 'customInstance',
        },
        query: {
          useQuery: true,
          useInfinite: false,
          queryKey: (params) => {
            const sortedParams = Object.keys(params || {})
              .sort()
              .reduce((acc, key) => {
                acc[key] = params[key];
                return acc;
              }, {} as Record<string, unknown>);
            return JSON.stringify(sortedParams);
          },
        },
      },
    },
    types: {
      output: './packages/types/src/auth.ts',
    },
  },
  token: {
    input: './docs/openapi/token.yaml',
    output: {
      target: './packages/sdk/src/token.ts',
      client: 'react-query',
      mode: 'tags-split',
      override: {
        mutator: {
          path: './packages/sdk/src/mutator.ts',
          name: 'customInstance',
        },
        query: {
          useQuery: true,
          useInfinite: false,
          queryKey: (params) => {
            const sortedParams = Object.keys(params || {})
              .sort()
              .reduce((acc, key) => {
                acc[key] = params[key];
                return acc;
              }, {} as Record<string, unknown>);
            return JSON.stringify(sortedParams);
          },
        },
      },
    },
    types: {
      output: './packages/types/src/token.ts',
    },
  },
  referral: {
    input: './docs/openapi/referral.yaml',
    output: {
      target: './packages/sdk/src/referral.ts',
      client: 'react-query',
      mode: 'tags-split',
      override: {
        mutator: {
          path: './packages/sdk/src/mutator.ts',
          name: 'customInstance',
        },
        query: {
          useQuery: true,
          useInfinite: false,
          queryKey: (params) => {
            const sortedParams = Object.keys(params || {})
              .sort()
              .reduce((acc, key) => {
                acc[key] = params[key];
                return acc;
              }, {} as Record<string, unknown>);
            return JSON.stringify(sortedParams);
          },
        },
      },
    },
    types: {
      output: './packages/types/src/referral.ts',
    },
  },
});
