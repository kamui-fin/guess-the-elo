export const fetcher = (...args) => fetch(...args).then((res) => res.json())

export const isEmpty = (obj) => Object.keys(obj).length === 0
