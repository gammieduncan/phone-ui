/** Ambient typing for CSS Modules so `import styles from "./X.module.css"` type-checks. */
declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}
