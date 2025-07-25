const userRouter = require('../api/v1/business/user/user_router');

const addRouters = (router) => {
    router.route('/health').get((req, res) => {
        res.setHeader('csrf-token', req.csrfToken());
        return res.status(200).send();
    });

    router.use('/user', userRouter);

    return router;
};

module.exports = addRouters;
