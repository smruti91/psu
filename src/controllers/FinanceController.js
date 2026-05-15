const pool = require('../config/db');
exports.setUserLocals = (req, res, next) => {
  if (req.session && req.session.user) {
    res.locals.user = req.session.user;
  } else {
    res.locals.user = null;
  }
  next();
};

exports.dashboard = async (req, res) => {
  console.log('Session data:', req.session.user);
    const userId = req.session.user.id;
    const role = req.session.user.role;
    let DemantData = null;
    const [rows] = await pool.execute(
      `SELECT * FROM tbl_department order BY DmdNo ASC`
    );
    if (rows && rows.length > 0) {
      DemantData = rows;
    }
    res.render('finance/dashboard', {
      layout: 'layouts/dashboard',
        title: 'Finance Dashboard',
        role: req.session.user.role,
        DemantData: DemantData
    });
};

exports.getPsuNames = async (req, res) => {
  const dmdNo = req.query.dmdNo;
  let psuNames = [];

  if (!dmdNo) {
    return res.json({ PsuNames: [] });
  }

  try {
    const [rows] = await pool.execute(
      `SELECT *FROM tbl_psu_name WHERE DmdNo = ?`,
      [dmdNo]
    );
    if (rows && rows.length > 0) {
      psuNames = rows;
    }
    res.json({ PsuNames: psuNames });
  } catch (err) {
    console.error('Error fetching PSU names:', err);
    res.status(500).json({ PsuNames: [] });
  }
};
