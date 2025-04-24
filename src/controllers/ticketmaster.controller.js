export const index = (req, res) => {
  const { id } = req.params;
  console.log(id);
  res.json({
    id: parseInt(id),
  });
};
