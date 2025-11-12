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
        },
      },
    },
    types: {
      output: './packages/types/src/referral.ts',
    },
  },
});
