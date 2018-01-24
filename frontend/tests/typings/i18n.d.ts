declare module NodeJS {
    interface Global {
        __: (key: string) => string,
        DISQUS_WP: any,
        XMLHttpRequest: any,
    }
}
