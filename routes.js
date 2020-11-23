module.exports = router => {
  // router.get("/test", (req,res)=>(res.send("Bacon and Eggs are tasty")));
  require('./routes/users')(router);
  return router;
};