'use strict';

export default {
  404: (req, res) => {
    const result = {
      status: 404,
    };

    res.status(result.status);
    res.render('404', (err, html) => {
      if (err) {
        return res.status(result.status).json(result);
      }

      res.send(html);
    });
  },
};
