const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },

  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.json',
    },
  },
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  moduleFileExtensions: ['ts', 'js'],
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    '^@lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@context/(.*)$': '<rootDir>/src/context/$1',
    '^@types/(.*)$': '<rootDir>/src/types/$1',
  },
};