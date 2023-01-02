module.exports = {
    parser: "@typescript-eslint/parser",
    plugins: ["jest"],
    env: {
        node: true,
        jest: true,
    },
    parserOptions: {
        project: "./tsconfig.json",
    },
    extends: ["airbnb-typescript/base", "plugin:jest/recommended", "plugin:import/recommended"],
    rules: {
        "no-console": "error",
    },
}
