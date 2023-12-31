module.exports = {
    css: {
        loaderOptions: {
            sass: {
                additionalData: '@import "@/styles/variables.scss";',
            },
        },
    },
    devServer: {
        proxy: {
            '^/api': {
                target: 'http://127.0.0.1:50000',
            },
            '^/django_admin': {
                target: 'http://127.0.0.1:50000',
            },
            '^/django_static': {
                target: 'http://127.0.0.1:50000',
            },
            '^/oauth_redirect': {
                target: 'http://127.0.0.1:50000',
            },
            '^/callback': {
                target: 'http://127.0.0.1:50000',
            },
            '^/ws/': {
                target: 'http://127.0.0.1:50000',
                ws: true,
            },
        },
    },
}
