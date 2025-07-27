// api/index.js
import { getProducts as getApparel } from './apparel'
import { getProducts as getBag } from './bag'
// import { getProducts as getFashion } from './fashion'

export async function getAllProducts() {
  //   const [apparel, bag, fashion] = await Promise.all([getApparel(), getBag(), getFashion()])
  //   return [...apparel, ...bag, ...fashion]
  const [apparel, bag] = await Promise.all([getApparel(), getBag()])
  return [...apparel, ...bag]
}

export const categoryApis = {
  apparel: getApparel,
  bag: getBag,
  //   fashion: getFashion,
}
