import pageRoutes from './router.config';

export default {
  targets: {
    ie: 10,
  },
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: false,
      title: 'noah',
      dll: false,
      hardSource: false,

      // {
      //   exclude: [
      //     /components/,
      //   ],
      // },
    }],
  ],
  routes: pageRoutes
}

