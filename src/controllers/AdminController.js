exports.dashboard = (req, res) => {
  res.render('admin/dashboard', {
    layout: 'layouts/admin', // use the admin layout
    title: 'Admin Dashboard'
  });
};
