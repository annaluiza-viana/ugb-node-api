const app = require("./src/app") //importação 
const PORT = 3000

app.listen(PORT, () => {
    console.log(`Server rodando em http://localhost:${PORT}`);
});