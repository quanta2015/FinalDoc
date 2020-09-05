export default {
    webpack(config, env, helpers, options) {
        // console.log(env);
        if(!env.isWatch) {
            config.optimization.splitChunks.chunks = "all";
            config.optimization.splitChunks.minChunks = 4;
            config.optimization.splitChunks.cacheGroups = {
                antd: {
                    name: 'antd',
                    test: /antd|@ant-design/,
                    priority: -10
                },
                moment: {
                    name: 'moment',
                    test: /moment/,
                    minChunks: 3,
                    priority: -10
                },
                vendors: {
                    name: 'vendors',
                    test: /[\\/]node_modules[\\/]/, 
                    priority: -20 
                }
            }
        }
    }
}