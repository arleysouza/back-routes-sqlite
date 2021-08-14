const { GastoModel } = require("../models");
const { getToken } = require("../middlewares");
const { Op } = require("sequelize");

class GastoController {
  async create(req, res) {
    const token = await getToken(req);
    if (!token || !token.idusuario) {
      return res.status(401).json({ error: ["Efetue o login para continuar"] });
    }

    let { descricao, valor } = req.body;
    descricao = (descricao || "").toString().trim();
    valor = (valor || "")
      .toString()
      .replace(/[,]+/g, ".")
      .replace(/[^\d\.]+/g, "");
    if (descricao === "") {
      return res.status(400).json({ error: ["Forneça a descrição do gasto"] });
    }
    if (valor === "") {
      return res.status(400).json({ error: ["Forneça o valor do gasto"] });
    }

    return await GastoModel.create({
      descricao,
      valor,
      idusuario: token.idusuario,
    })
      .then(async (gasto) => {
        const { descricao, valor, createdAt } = gasto.get();
        return res.status(200).json({ descricao, valor, createdAt });
      })
      .catch((err) => {
        try {
          return res.status(400).json({
            error: err.errors.map((item) => item.message),
            type: "validation",
          });
        } catch (e) {
          return res.status(400).json({ error: [e.message] });
        }
      });
  }

  async update(req, res) {
    const token = await getToken(req);
    if (!token || !token.idusuario) {
      return res.status(401).json({ error: ["Efetue o login para continuar"] });
    }

    let { idgasto, descricao, valor } = req.body;
    idgasto = (idgasto || "").toString().replace(/[^\d]+/g, "");
    descricao = (descricao || "").toString().trim();
    valor = (valor || "")
      .toString()
      .replace(/[,]+/g, ".")
      .replace(/[^\d\.]+/g, "");
    if (idgasto === "") {
      return res.status(400).json({ error: ["Gasto não identificado"] });
    }
    if (descricao === "") {
      return res.status(400).json({ error: ["Forneça a descrição do gasto"] });
    }
    if (valor === "") {
      return res.status(400).json({ error: ["Forneça o valor do gasto"] });
    }

    return await GastoModel.findOne({
      where: { idgasto, idusuario: token.idusuario },
    })
      .then(async (gasto) => {
        if (gasto) {
          await gasto.update({ descricao, valor });
          return res.status(200).json({
            descricao,
            valor,
          });
        }
        return res.status(400).json({ error: ["Gasto não identificado"] });
      })
      .catch((err) => {
        try {
          return res.status(400).json({
            error: err.errors.map((item) => item.message),
            type: "validation",
          });
        } catch (e) {
          return res.status(400).json({ error: [e.message] });
        }
      });
  }

  async remove(req, res) {
    const token = await getToken(req);
    if (!token || !token.idusuario) {
      return res.status(401).json({ error: ["Efetue o login para continuar"] });
    }

    let { idgasto } = req.body;
    idgasto = (idgasto || "").toString().replace(/[^\d]+/g, "");
    if (idgasto === "") {
      return res
        .status(400)
        .json({ error: ["Forneça a identificação do gasto"] });
    }

    return await GastoModel.findOne({ where: { idgasto, idusuario:token.idusuario } })
      .then(async (gasto) => {
        if (gasto !== null) {
          await gasto.destroy();
          return res.status(200).json({ idgasto });
        } else {
          return res.status(400).json({ error: ["Registro inexistente"] });
        }
      })
      .catch((err) => {
        try {
          return res.status(400).json({
            error: err.errors.map((item) => item.message),
            type: "validation",
          });
        } catch (e) {
          return res.status(400).json({ error: [e.message] });
        }
      });
  }

  async listAll(req, res) {
    const token = await getToken(req);
    if (!token || !token.idusuario) {
      return res.status(401).json({ error: ["Efetue o login para continuar"] });
    }

    let { limit, offset } = req.body;
    return await GastoModel.findAndCountAll({
      where: { idusuario: token.idusuario },
      attributes: ["idgasto", "descricao", "valor", "createdAt"],
      order: [["idgasto", "DESC"]],
      offset,
      limit,
    })
      .then((gastos) => {
        return res.status(200).json({
          gastos: gastos.rows.map((item) => item.get()),
          count: gastos.count,
        });
      })
      .catch((e) => {
        return res.status(400).json({ error: [e.message] });
      });
  }

  async listByDescricao(req, res) {
    const token = await getToken(req);
    if (!token || !token.idusuario) {
      return res.status(401).json({ error: ["Efetue o login para continuar"] });
    }

    let { limit, offset, descricao } = req.body;
    descricao = (descricao || "").toString().trim();
    if (descricao === "") {
      return res
        .status(400)
        .json({ error: ["Forneça a descrição do gasto para a busca"] });
    }

    return await GastoModel.findAndCountAll({
      where: {
        idusuario: token.idusuario,
        descricao: {
          [Op.like]: "%" + descricao + "%",
        },
      },
      attributes: ["idgasto", "descricao", "valor", "createdAt"],
      order: [["idgasto", "DESC"]],
      offset,
      limit,
    })
      .then((gastos) => {
        return res.status(200).json({
          gastos: gastos.rows.map((item) => item.get()),
          count: gastos.count,
        });
      })
      .catch((e) => {
        return res.status(400).json({ error: [e.message] });
      });
  }
}

module.exports = GastoController;
