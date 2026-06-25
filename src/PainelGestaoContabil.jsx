import { useState } from "react";
import { useSync } from "./useSync";

// ─── Competências disponíveis Jul–Dez 2026 ────────────────────────────────────
const COMPETENCIAS = [
  { key: "2026-07", label: "Julho/2026",    mes: 7,  ano: 2026, mesComp: "jun/26", trimestreLabel: "2º trim/2026", trimestre: true  },
  { key: "2026-08", label: "Agosto/2026",   mes: 8,  ano: 2026, mesComp: "jul/26", trimestreLabel: null,           trimestre: false },
  { key: "2026-09", label: "Setembro/2026", mes: 9,  ano: 2026, mesComp: "ago/26", trimestreLabel: "3º trim/2026", trimestre: true  },
  { key: "2026-10", label: "Outubro/2026",  mes: 10, ano: 2026, mesComp: "set/26", trimestreLabel: null,           trimestre: false },
  { key: "2026-11", label: "Novembro/2026", mes: 11, ano: 2026, mesComp: "out/26", trimestreLabel: null,           trimestre: false },
  { key: "2026-12", label: "Dezembro/2026", mes: 12, ano: 2026, mesComp: "nov/26", trimestreLabel: "4º trim/2026", trimestre: true  },
];

function getCompetencia(key) {
  return COMPETENCIAS.find(c => c.key === key) || COMPETENCIAS[0];
}

// Formata data DD/MM/YYYY para um dia/mês/ano dados
function fmtData(dia, mes, ano) {
  return `${String(dia).padStart(2,"0")}/${String(mes).padStart(2,"0")}/${ano}`;
}

// Último dia útil do mês (simplificado: último dia do mês)
function lastDay(mes, ano) {
  return new Date(ano, mes, 0).getDate();
}

const empresas = [
  { id: 1, razao: "KE LTDA (Matriz)", cnpj: "03.089.799/0001-22", cidade: "Curitiba/PR", regime: "Lucro Presumido", ramo: "Comércio Atacadista", folha: true, dirf: true, reinf: true, ecd: true, ecf: true, efd_contrib: true, efd_fiscal: true, dctf: true, mit: true, defis: false, dasn: false, dimob: false },
  { id: 2, razao: "KE LTDA (Filial)", cnpj: "03.089.799/0004-75", cidade: "Curitiba/PR", regime: "Lucro Presumido", ramo: "Representação Comercial", folha: false, dirf: true, reinf: true, ecd: true, ecf: true, efd_contrib: true, efd_fiscal: true, dctf: true, mit: true, defis: false, dasn: false, dimob: false },
  { id: 3, razao: "KE LTDA (Filial)", cnpj: "03.089.799/0005-56", cidade: "Maringá/PR", regime: "Lucro Presumido", ramo: "Representação Comercial", folha: false, dirf: true, reinf: true, ecd: true, ecf: true, efd_contrib: true, efd_fiscal: true, dctf: true, mit: true, defis: false, dasn: false, dimob: false },
  { id: 4, razao: "TRE ECOMMERCE LTDA (Matriz)", cnpj: "41.907.880/0001-61", cidade: "Curitiba/PR", regime: "Simples Nacional", ramo: "Comércio Varejista", folha: true, dirf: false, reinf: true, ecd: false, ecf: false, efd_contrib: false, efd_fiscal: false, dctf: true, mit: false, defis: true, dasn: true, dimob: false },
  { id: 5, razao: "TRE ECOMMERCE LTDA (Filial)", cnpj: "41.907.880/0002-42", cidade: "Rio de Janeiro/RJ", regime: "Simples Nacional", ramo: "Comércio Varejista", folha: false, dirf: false, reinf: true, ecd: false, ecf: false, efd_contrib: false, efd_fiscal: false, dctf: true, mit: false, defis: true, dasn: true, dimob: false },
  { id: 6, razao: "UNIQUE MIDIA LTDA.", cnpj: "41.447.474/0001-63", cidade: "Curitiba/PR", regime: "Simples Nacional", ramo: "Comércio Varejista", folha: false, dirf: false, reinf: true, ecd: false, ecf: false, efd_contrib: false, efd_fiscal: false, dctf: true, mit: false, defis: true, dasn: true, dimob: false },
  { id: 7, razao: "FOUR ADMINISTRACAO DE BENS LTDA", cnpj: "41.562.411/0001-58", cidade: "Curitiba/PR", regime: "Lucro Presumido", ramo: "Compra e Venda de Imóveis", folha: false, dirf: true, reinf: true, ecd: true, ecf: true, efd_contrib: true, efd_fiscal: false, dctf: true, mit: true, defis: false, dasn: false, dimob: true },
  { id: 8, razao: "KE PARTICIPACOES LTDA", cnpj: "50.421.483/0001-76", cidade: "Curitiba/PR", regime: "Lucro Presumido", ramo: "Holdings", folha: false, dirf: true, reinf: true, ecd: true, ecf: true, efd_contrib: true, efd_fiscal: false, dctf: true, mit: false, defis: false, dasn: false, dimob: false },
  { id: 9, razao: "KMS LTDA", cnpj: "48.226.273/0001-85", cidade: "Curitiba/PR", regime: "Lucro Presumido", ramo: "Holdings", folha: false, dirf: true, reinf: true, ecd: true, ecf: true, efd_contrib: true, efd_fiscal: false, dctf: true, mit: false, defis: false, dasn: false, dimob: false },
  { id: 10, razao: "JNS LTDA", cnpj: "48.213.073/0001-98", cidade: "Curitiba/PR", regime: "Lucro Presumido", ramo: "Holdings", folha: false, dirf: true, reinf: true, ecd: true, ecf: true, efd_contrib: true, efd_fiscal: false, dctf: true, mit: false, defis: false, dasn: false, dimob: false },
  { id: 11, razao: "KVS LTDA", cnpj: "48.239.949/0001-75", cidade: "Curitiba/PR", regime: "Lucro Presumido", ramo: "Holdings", folha: false, dirf: true, reinf: true, ecd: true, ecf: true, efd_contrib: true, efd_fiscal: false, dctf: true, mit: false, defis: false, dasn: false, dimob: false },
];

const obrigacoesConfig = [
  { key: "pgdas_dasn", label: "PGDAS-D / DAS", tipo: "acessoria", periodicidade: "Mensal", venc: "Dia 20 de cada mês", orgao: "Receita Federal", checkFn: e => e.dasn },
  { key: "defis", label: "DEFIS", tipo: "acessoria", periodicidade: "Anual", venc: "31/03 (ano seguinte)", orgao: "Receita Federal", checkFn: e => e.defis },
  { key: "dctf", label: "DCTF-Web", tipo: "acessoria", periodicidade: "Mensal", venc: "Dia 15 do mês seguinte", orgao: "Receita Federal", checkFn: e => e.dctf },
  { key: "efd_contrib", label: "EFD-Contribuições", tipo: "acessoria", periodicidade: "Mensal", venc: "10º dia útil do 2º mês seguinte", orgao: "Receita Federal", checkFn: e => e.efd_contrib },
  { key: "efd_fiscal", label: "EFD-Fiscal (SPED)", tipo: "acessoria", periodicidade: "Mensal", venc: "15º dia útil do mês seguinte", orgao: "SEFAZ/Receita Federal", checkFn: e => e.efd_fiscal },
  { key: "mit", label: "MIT", tipo: "acessoria", periodicidade: "Mensal", venc: "Último dia útil do mês", orgao: "Receita Federal", checkFn: e => e.mit },
  { key: "reinf", label: "EFD-REINF", tipo: "acessoria", periodicidade: "Mensal", venc: "Dia 15 do mês seguinte", orgao: "Receita Federal", checkFn: e => e.reinf },
  { key: "ecd", label: "ECD (SPED Contábil)", tipo: "acessoria", periodicidade: "Anual", venc: "Último dia útil de junho", orgao: "Receita Federal", checkFn: e => e.ecd },
  { key: "ecf", label: "ECF", tipo: "acessoria", periodicidade: "Anual", venc: "Último dia útil de julho", orgao: "Receita Federal", checkFn: e => e.ecf },
  { key: "dimob", label: "DIMOB", tipo: "acessoria", periodicidade: "Anual", venc: "Último dia útil de fevereiro", orgao: "Receita Federal", checkFn: e => e.dimob },
  { key: "dirf", label: "DIRF", tipo: "acessoria", periodicidade: "Anual", venc: "Último dia útil de fevereiro", orgao: "Receita Federal", checkFn: e => e.dirf },
];

// ─── Tributos por regime ────────────────────────────────────────────────────────
// Lucro Presumido
const tributosLP = [
  { key: "irpj", label: "IRPJ", grupo: "Federal", base: "Lucro presumido", aliquota: "15% + 10% adicional", venc: "Último dia útil do mês seguinte ao trimestre", periodicidade: "Trimestral", darf: "2089", checkFn: () => true },
  { key: "csll", label: "CSLL", grupo: "Federal", base: "Lucro presumido", aliquota: "9% (geral) / 15% (financeiras)", venc: "Último dia útil do mês seguinte ao trimestre", periodicidade: "Trimestral", darf: "2372", checkFn: () => true },
  { key: "pis_lp", label: "PIS", grupo: "Federal", base: "Faturamento", aliquota: "0,65%", venc: "Último dia útil do 2º decêndio do mês seguinte", periodicidade: "Mensal", darf: "8109", checkFn: () => true },
  { key: "cofins_lp", label: "COFINS", grupo: "Federal", base: "Faturamento", aliquota: "3%", venc: "Último dia útil do 2º decêndio do mês seguinte", periodicidade: "Mensal", darf: "2172", checkFn: () => true },
  { key: "inss_lp", label: "INSS (CPP)", grupo: "Previdenciário", base: "Folha de pagamento", aliquota: "20% + RAT + terceiros", venc: "Dia 20 do mês seguinte", periodicidade: "Mensal", darf: "GPS", checkFn: e => e.folha },
  { key: "fgts_lp", label: "FGTS", grupo: "Trabalhista", base: "Folha de pagamento", aliquota: "8%", venc: "Dia 20 do mês seguinte", periodicidade: "Mensal", darf: "GRF", checkFn: e => e.folha },
  { key: "irrf_lp", label: "IRRF (Salários)", grupo: "Federal", base: "Folha de pagamento", aliquota: "Tabela progressiva", venc: "Dia 20 do mês seguinte", periodicidade: "Mensal", darf: "0561", checkFn: e => e.folha },
  { key: "irrf_serv_lp", label: "IRRF (Serviços)", grupo: "Federal", base: "Serviços tomados", aliquota: "1,5% a 1%", venc: "Dia 20 do mês seguinte", periodicidade: "Mensal", darf: "1708", checkFn: () => true },
  { key: "iss_lp", label: "ISS", grupo: "Municipal", base: "Receita de serviços", aliquota: "2% a 5% (conforme município)", venc: "Conforme legislação municipal", periodicidade: "Mensal", darf: "ISS-DAM", checkFn: () => true },
];

// Simples Nacional
const tributosSN = [
  { key: "das_sn", label: "DAS (Simples Nacional)", grupo: "Federal/Unificado", base: "Receita bruta mensal", aliquota: "Tabela do Anexo aplicável (varia por faixa)", venc: "Dia 20 do mês seguinte", periodicidade: "Mensal", darf: "DAS", checkFn: () => true },
  { key: "inss_sn", label: "INSS (CPP — incluso no DAS)", grupo: "Previdenciário", base: "Incluso no DAS", aliquota: "Incluso no DAS", venc: "Dia 20 (junto ao DAS)", periodicidade: "Mensal", darf: "DAS", checkFn: () => true },
  { key: "fgts_sn", label: "FGTS", grupo: "Trabalhista", base: "Folha de pagamento", aliquota: "8%", venc: "Dia 20 do mês seguinte", periodicidade: "Mensal", darf: "GRF", checkFn: e => e.folha },
  { key: "irrf_sn", label: "IRRF (Salários)", grupo: "Federal", base: "Folha de pagamento", aliquota: "Tabela progressiva", venc: "Dia 20 do mês seguinte", periodicidade: "Mensal", darf: "0561", checkFn: e => e.folha },
  { key: "iss_sn", label: "ISS (Municípios optantes)", grupo: "Municipal", base: "Incluso no DAS se município aderiu ao SN", aliquota: "Incluso no DAS ou recolhido à parte", venc: "Dia 20 (DAS) ou conforme município", periodicidade: "Mensal", darf: "DAS/DAM", checkFn: () => true },
];

const statusOptions = ["A Fazer", "Em Andamento", "Entregue"];
const statusColors = {
  "A Fazer": { bg: "#FEF3C7", text: "#92400E", border: "#FCD34D" },
  "Em Andamento": { bg: "#DBEAFE", text: "#1E40AF", border: "#93C5FD" },
  "Entregue": { bg: "#D1FAE5", text: "#065F46", border: "#6EE7B7" },
};
const regimeColors = {
  "Lucro Presumido": { bg: "#EDE9FE", text: "#5B21B6", dot: "#7C3AED" },
  "Simples Nacional": { bg: "#FEF3C7", text: "#92400E", dot: "#D97706" },
};
const catColors = {
  acessoria: { bg: "#DBEAFE", text: "#1E40AF", label: "Obrigação Acessória", icon: "📋" },
  contabil: { bg: "#FEF9C3", text: "#713F12", label: "Fechamento Contábil", icon: "📊" },
  dp: { bg: "#DCFCE7", text: "#14532D", label: "Folha / DP", icon: "👥" },
};
const grupoColors = {
  Federal: { bg: "#DBEAFE", text: "#1E40AF" },
  "Federal/Unificado": { bg: "#EDE9FE", text: "#5B21B6" },
  Previdenciário: { bg: "#FEF3C7", text: "#92400E" },
  Trabalhista: { bg: "#DCFCE7", text: "#14532D" },
  Municipal: { bg: "#FCE7F3", text: "#831843" },
};

const fechamentoTasks = [
  { key: "recebimento_docs", label: "Recebimento de documentos do cliente", dia: 5 },
  { key: "lancamentos", label: "Lançamentos contábeis", dia: 10 },
  { key: "conciliacao", label: "Conciliação bancária", dia: 15 },
  { key: "apuracao", label: "Apuração de impostos", dia: 18 },
  { key: "envio_balancete", label: "Envio de balancete ao cliente", dia: 25 },
  { key: "dre_gerencial", label: "DRE Gerencial — Apresentação aos Sócios", dia: 28, destaque: true },
];
const dpTasks = [
  { key: "coleta_eventos", label: "Coleta de eventos variáveis", dia: 25, mes_ant: true },
  { key: "processamento_folha", label: "Processamento da folha", dia: 28, mes_ant: true },
  { key: "pagamento_func", label: "Pagamento dos funcionários", dia: 5 },
  { key: "fgts", label: "Recolhimento FGTS", dia: 20 },
  { key: "inss_gps", label: "Pagamento INSS (GPS)", dia: 20 },
  { key: "irrf_darf", label: "Pagamento IRRF (DARF)", dia: 20 },
  { key: "esocial_reinf", label: "eSocial / EFD-REINF (fechamento)", dia: 15 },
];
function getPrazoscriticos(comp) {
  const { mes, ano, mesComp, trimestreLabel } = comp;
  const ld = lastDay(mes, ano);
  const items = [
    { empresa: "Todas Lucro Presumido",     obrigacao: `EFD-REINF (comp. ${mesComp})`,          venc: fmtData(15, mes, ano), dias: 15, tipo: "acessoria" },
    { empresa: "Todos com folha",           obrigacao: `FGTS + INSS/IRRF (comp. ${mesComp})`,   venc: fmtData(20, mes, ano), dias: 20, tipo: "dp" },
    { empresa: "Simples Nacional",          obrigacao: `PGDAS-D / DAS (comp. ${mesComp})`,       venc: fmtData(20, mes, ano), dias: 20, tipo: "acessoria" },
    { empresa: "Todas LP",                  obrigacao: `DCTF-Web (comp. ${mesComp})`,            venc: fmtData(15, mes, ano), dias: 15, tipo: "acessoria" },
    { empresa: "Todas LP",                  obrigacao: `Fechamento + Balancete`,                 venc: fmtData(25, mes, ano), dias: 25, tipo: "contabil" },
  ];
  if (trimestreLabel) {
    items.unshift({ empresa: "KE LTDA + Holdings LP", obrigacao: `IRPJ/CSLL (${trimestreLabel})`, venc: fmtData(ld, mes, ano), dias: ld, tipo: "contabil" });
  }
  if (mes === 7) {
    items.unshift({ empresa: "KE LTDA (Matriz) + Filiais", obrigacao: "ECF (Anual)", venc: fmtData(ld, mes, ano), dias: ld, tipo: "acessoria" });
  }
  return items.slice(0, 5);
}


// ─── Shared components ─────────────────────────────────────────────────────────
function Badge({ regime }) {
  const c = regimeColors[regime] || { bg: "#F3F4F6", text: "#374151", dot: "#9CA3AF" };
  return (
    <span style={{ background: c.bg, color: c.text, padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4, whiteSpace: "nowrap" }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.dot, display: "inline-block" }} />
      {regime}
    </span>
  );
}
function StatusBadge({ status, onChange }) {
  const c = statusColors[status];
  return (
    <select value={status} onChange={e => onChange(e.target.value)}
      style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}`, borderRadius: 6, padding: "2px 6px", fontSize: 11, fontWeight: 600, cursor: "pointer", appearance: "none" }}>
      {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
    </select>
  );
}
function CatTag({ tipo }) {
  const c = catColors[tipo];
  return <span style={{ background: c.bg, color: c.text, padding: "1px 7px", borderRadius: 10, fontSize: 10, fontWeight: 700 }}>{c.icon} {c.label}</span>;
}

// ─── Progress helpers ──────────────────────────────────────────────────────────
function getAllTasks(e) {
  const tasks = [];
  obrigacoesConfig.forEach(o => { if (o.checkFn(e)) tasks.push({ key: o.key, label: o.label, tipo: "acessoria" }); });
  fechamentoTasks.forEach(t => tasks.push({ key: `fech_${t.key}`, label: t.label, tipo: "contabil" }));
  if (e.folha) dpTasks.forEach(t => tasks.push({ key: `dp_${t.key}`, label: t.label, tipo: "dp" }));
  return tasks;
}
function getProgress(tasks, statuses, empresaId) {
  const total = tasks.length;
  if (total === 0) return { pct: 0, entregue: 0, andamento: 0, pendente: 0, total: 0 };
  const entregue = tasks.filter(t => (statuses[`${empresaId}_${t.key}`] || "A Fazer") === "Entregue").length;
  const andamento = tasks.filter(t => (statuses[`${empresaId}_${t.key}`] || "A Fazer") === "Em Andamento").length;
  const pendente = total - entregue - andamento;
  const pct = Math.round(((entregue + andamento * 0.5) / total) * 100);
  return { pct, entregue, andamento, pendente, total };
}

function ProgressRuler({ pct, entregue, andamento, pendente, total }) {
  const pctEntregue = total > 0 ? Math.round((entregue / total) * 100) : 0;
  const pctAndamento = total > 0 ? Math.round((andamento / total) * 100) : 0;
  const color = pct >= 80 ? "#16A34A" : pct >= 50 ? "#D97706" : pct >= 20 ? "#EA580C" : "#DC2626";
  const bgColor = pct >= 80 ? "#DCFCE7" : pct >= 50 ? "#FEF3C7" : pct >= 20 ? "#FFEDD5" : "#FEE2E2";
  return (
    <div style={{ width: "100%" }}>
      <div style={{ position: "relative", background: "#E2E8F0", borderRadius: 99, height: 14, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${pctEntregue}%`, background: "#16A34A", transition: "width 0.6s" }} />
        <div style={{ position: "absolute", left: `${pctEntregue}%`, top: 0, height: "100%", width: `${pctAndamento}%`, background: "repeating-linear-gradient(45deg,#2563EB 0,#2563EB 4px,#3B82F6 4px,#3B82F6 8px)", transition: "width 0.6s" }} />
        {[25,50,75].map(tick => <div key={tick} style={{ position: "absolute", left: `${tick}%`, top: 0, height: "100%", width: 1, background: "rgba(255,255,255,0.5)" }} />)}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
        <div style={{ display: "flex", gap: 10 }}>
          <span style={{ fontSize: 10, color: "#16A34A", fontWeight: 700 }}>✓ {entregue} entregue{entregue !== 1 ? "s" : ""}</span>
          <span style={{ fontSize: 10, color: "#2563EB", fontWeight: 700 }}>◑ {andamento} em andamento</span>
          <span style={{ fontSize: 10, color: "#DC2626", fontWeight: 700 }}>○ {pendente} pendente{pendente !== 1 ? "s" : ""}</span>
        </div>
        <span style={{ fontSize: 11, fontWeight: 800, color, background: bgColor, padding: "1px 8px", borderRadius: 20 }}>{pct}%</span>
      </div>
    </div>
  );
}

// ─── Módulo Vencimento de Impostos ─────────────────────────────────────────────
const LOGO_B64 = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAZABkADASIAAhEBAxEB/8QAHgABAAMBAQEBAQEBAAAAAAAAAAcJCggDBgUCBAH/xABkEAEAAAMEBAsEAwoKBQYLCQAAAQIDBAUGBwgJEbESITM0Nzhyc3V2tBMxQbMiUbIUMlJhcYGRlMTTFRgZI0JXWIKWoRYkVWKkVpKjtcHRFyYnQ0ZTdIOTpcIlNUVUY4Siw9L/xAAcAQEAAwEBAQEBAAAAAAAAAAAABgcIBQQDAgH/xABJEQEAAQICBAgLBQUHBAMBAAAAAQIEAwUGBxGxITE0NnFzgbISMzVBUWFyg5GzwRMiMqHRFCNCUoIVFiRTYuHwVJKi8SVDwtL/2gAMAwEAAhEDEQA/ALPQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf//Z";

function fmtBRL(v) {
  if (!v && v !== 0) return "";
  const n = parseFloat(v.toString().replace(/\./g, "").replace(",", "."));
  if (isNaN(n)) return v;
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function ModuloImpostos({ pagamentos, setPagamentos, valores, setValores, comp }) {
  const [activeEmp, setActiveEmp] = useState(0);
  const [filterGrupo, setFilterGrupo] = useState("Todos");
  const e = empresas[activeEmp];
  const tributos = e.regime === "Simples Nacional" ? tributosSN : tributosLP;
  const aplicaveis = tributos.filter(t => t.checkFn(e));
  const grupos = ["Todos", ...new Set(aplicaveis.map(t => t.grupo))];
  const filtrados = filterGrupo === "Todos" ? aplicaveis : aplicaveis.filter(t => t.grupo === filterGrupo);

  // Mês de VENCIMENTO = mês seguinte à competência
  const mesVenc = comp.mes === 12 ? 1 : comp.mes + 1;
  const anoVenc = comp.mes === 12 ? comp.ano + 1 : comp.ano;
  const mesVencStr = String(mesVenc).padStart(2, "0");
  const anoVencStr = String(anoVenc);
  const ldVenc = lastDay(mesVenc, anoVenc);
  const mesVencNome = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"][mesVenc - 1];

  // Gera texto de vencimento real por tributo
  const getVencReal = (t) => {
    if (t.venc.includes("Dia 20"))                   return fmtData(20, mesVenc, anoVenc);
    if (t.venc.includes("Dia 15"))                   return fmtData(15, mesVenc, anoVenc);
    if (t.venc.includes("decêndio") || t.venc.includes("decendio")) return fmtData(20, mesVenc, anoVenc); // PIS/COFINS LP: último dia 2º decêndio ≈ dia 20
    if (t.venc.includes("trimestre"))                {
      // IRPJ/CSLL trimestral: último dia do mês seguinte ao trimestre
      return fmtData(ldVenc, mesVenc, anoVenc);
    }
    if (t.venc.includes("Último dia"))               return fmtData(ldVenc, mesVenc, anoVenc);
    if (t.venc.includes("legislação municipal"))      return `Conf. município — até ${fmtData(ldVenc, mesVenc, anoVenc)}`;
    return t.venc; // fallback para anuais (DEFIS, DIRF etc.)
  };

  // Para timeline: classificar dia de venc
  const getDiaVenc = (t) => {
    const v = getVencReal(t);
    const match = v.match(/^(\d{2})/);
    return match ? parseInt(match[1]) : null;
  };

  const pagKey = (tribKey) => `${e.id}_${tribKey}`;
  const valKey = (tribKey) => `${e.id}_val_${tribKey}`;
  const isPago = (tribKey) => pagamentos[pagKey(tribKey)] === true;
  const getValor = (tribKey) => valores[valKey(tribKey)] || "";
  const setValor = (tribKey, v) => setValores(prev => ({ ...prev, [valKey(tribKey)]: v }));
  const togglePago = (tribKey) => {
    const k = pagKey(tribKey);
    setPagamentos(prev => ({ ...prev, [k]: !prev[k] }));
  };

  // Agrupado por data real de vencimento
  const vencAgrupado = {};
  filtrados.forEach(t => {
    const k = getVencReal(t);
    if (!vencAgrupado[k]) vencAgrupado[k] = [];
    vencAgrupado[k].push(t);
  });

  const totalAplicaveis = aplicaveis.length;
  const totalPagos = aplicaveis.filter(t => isPago(t.key)).length;
  const pctPago = totalAplicaveis > 0 ? Math.round((totalPagos / totalAplicaveis) * 100) : 0;

  // Total a recolher da empresa atual (filtrados)
  const totalRecolher = filtrados.reduce((acc, t) => {
    const raw = getValor(t.key).toString().replace(/\./g, "").replace(",", ".");
    const n = parseFloat(raw);
    return acc + (isNaN(n) ? 0 : n);
  }, 0);
  const totalPago = filtrados.filter(t => isPago(t.key)).reduce((acc, t) => {
    const raw = getValor(t.key).toString().replace(/\./g, "").replace(",", ".");
    const n = parseFloat(raw);
    return acc + (isNaN(n) ? 0 : n);
  }, 0);
  const totalPendVal = totalRecolher - totalPago;

  return (
    <div>
      {/* Seletor empresa */}
      <div style={{ background: "white", borderRadius: 12, padding: 16, marginBottom: 20, border: "1px solid #E2E8F0" }}>
        <div style={{ fontWeight: 600, fontSize: 13, color: "#64748B", marginBottom: 10 }}>Empresa:</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {empresas.map((emp, i) => {
            const empTributos = (emp.regime === "Simples Nacional" ? tributosSN : tributosLP).filter(t => t.checkFn(emp));
            const empPagos = empTributos.filter(t => pagamentos[`${emp.id}_${t.key}`] === true).length;
            const empPct = empTributos.length > 0 ? Math.round((empPagos / empTributos.length) * 100) : 0;
            return (
              <button key={emp.id} onClick={() => { setActiveEmp(i); setFilterGrupo("Todos"); }} style={{
                padding: "5px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                border: `2px solid ${activeEmp === i ? "#2563EB" : "#E2E8F0"}`,
                background: activeEmp === i ? "#EFF6FF" : "white",
                color: activeEmp === i ? "#1D4ED8" : "#64748B", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 5
              }}>
                {emp.razao.length > 22 ? emp.razao.slice(0, 22) + "…" : emp.razao}
                <span style={{ background: empPct === 100 ? "#DCFCE7" : empPct > 0 ? "#DBEAFE" : "#FEE2E2", color: empPct === 100 ? "#15803D" : empPct > 0 ? "#1D4ED8" : "#991B1B", borderRadius: 10, padding: "0px 5px", fontSize: 10, fontWeight: 800 }}>
                  {empPct}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Header empresa + mini progress */}
      <div style={{ background: "linear-gradient(135deg,#1E3A5F,#2563EB)", borderRadius: 12, padding: "16px 20px", marginBottom: 20, color: "white" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800 }}>{e.razao}</div>
            <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>{e.cnpj} · {e.cidade} · {e.ramo}</div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <Badge regime={e.regime} />
            {e.folha && <span style={{ background: "rgba(255,255,255,0.15)", color: "white", padding: "2px 10px", borderRadius: 12, fontSize: 11, fontWeight: 600 }}>👥 Com folha</span>}
            <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: "6px 14px", textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 800 }}>{totalPagos}/{totalAplicaveis}</div>
              <div style={{ fontSize: 10, opacity: 0.85 }}>Guias pagas</div>
            </div>
            {totalRecolher > 0 && (
              <>
                <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: "6px 14px", textAlign: "center" }}>
                  <div style={{ fontSize: 15, fontWeight: 800 }}>{totalRecolher.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</div>
                  <div style={{ fontSize: 10, opacity: 0.85 }}>Total a recolher</div>
                </div>
                <div style={{ background: totalPendVal > 0 ? "rgba(220,38,38,0.35)" : "rgba(22,163,74,0.35)", borderRadius: 10, padding: "6px 14px", textAlign: "center" }}>
                  <div style={{ fontSize: 15, fontWeight: 800 }}>{totalPendVal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</div>
                  <div style={{ fontSize: 10, opacity: 0.85 }}>{totalPendVal > 0 ? "Saldo pendente" : "Tudo pago ✓"}</div>
                </div>
              </>
            )}
          </div>
        </div>
        {/* mini ruler */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 10, opacity: 0.8 }}>Progresso de Pagamentos</span>
            <span style={{ fontSize: 11, fontWeight: 800 }}>{pctPago}%</span>
          </div>
          <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 99, height: 8, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pctPago}%`, background: pctPago === 100 ? "#4ADE80" : "#FCD34D", borderRadius: 99, transition: "width 0.5s" }} />
          </div>
        </div>
      </div>

      {/* Filtro grupo */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: "#64748B", fontWeight: 600 }}>Grupo:</span>
        {grupos.map(g => (
          <button key={g} onClick={() => setFilterGrupo(g)} style={{
            padding: "4px 12px", borderRadius: 16, fontSize: 11, fontWeight: 600,
            border: `1.5px solid ${filterGrupo === g ? "#2563EB" : "#E2E8F0"}`,
            background: filterGrupo === g ? "#EFF6FF" : "white",
            color: filterGrupo === g ? "#1D4ED8" : "#64748B", cursor: "pointer"
          }}>{g}</button>
        ))}
      </div>

      {/* Tabela tributos */}
      <div style={{ background: "white", borderRadius: 12, border: "1px solid #E2E8F0", overflow: "hidden", marginBottom: 24 }}>
        <div style={{ background: "#F8FAFC", borderBottom: "2px solid #E2E8F0", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 800, fontSize: 14, color: "#1E293B" }}>💰 Calendário de Impostos — {e.razao} — Comp. {comp.label} / Venc. {mesVencNome}/{anoVencStr}</span>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ background: "#DCFCE7", color: "#15803D", fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 10 }}>✓ {filtrados.filter(t => isPago(t.key)).length} pagos</span>
            <span style={{ background: "#FEE2E2", color: "#991B1B", fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 10 }}>○ {filtrados.filter(t => !isPago(t.key)).length} pendentes</span>
          </div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: "#1E3A5F", color: "white" }}>
              {["Tributo", "Grupo", "Base de Cálculo", "Alíquota", "Periodicidade", `Vencimento (${mesVencNome}/${anoVencStr})`, "Código/Guia", "Valor a Recolher (R$)", "Pagamento"].map(h => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 700, fontSize: 11, whiteSpace: h === "Valor a Recolher (R$)" ? "nowrap" : "normal" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtrados.map((t, i) => {
              const gc = grupoColors[t.grupo] || { bg: "#F3F4F6", text: "#374151" };
              const pago = isPago(t.key);
              return (
                <tr key={t.key} style={{ borderBottom: "1px solid #F1F5F9", background: pago ? "#F0FDF4" : i % 2 === 0 ? "white" : "#FAFAFA", transition: "background 0.2s" }}>
                  <td style={{ padding: "11px 14px", fontWeight: 700, color: pago ? "#64748B" : "#1E293B", textDecoration: pago ? "line-through" : "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      {pago && <span style={{ fontSize: 13 }}>✅</span>}
                      {t.label}
                    </div>
                  </td>
                  <td style={{ padding: "11px 14px" }}>
                    <span style={{ background: gc.bg, color: gc.text, padding: "2px 8px", borderRadius: 8, fontSize: 10, fontWeight: 700 }}>{t.grupo}</span>
                  </td>
                  <td style={{ padding: "11px 14px", color: "#475569", fontSize: 11 }}>{t.base}</td>
                  <td style={{ padding: "11px 14px" }}>
                    <span style={{ fontWeight: 700, color: pago ? "#94A3B8" : "#DC2626", fontSize: 12 }}>{t.aliquota}</span>
                  </td>
                  <td style={{ padding: "11px 14px", color: "#64748B", fontSize: 11 }}>{t.periodicidade}</td>
                  <td style={{ padding: "11px 14px" }}>
                    <span style={{
                      background: pago ? "#F0FDF4" : getVencReal(t).includes("/"+mesVencStr+"/") && parseInt(getVencReal(t).split("/")[0]) >= 20 ? "#FEE2E2" : getVencReal(t).includes("/"+mesVencStr+"/") ? "#FEF3C7" : "#F0FDF4",
                      color: pago ? "#94A3B8" : getVencReal(t).includes("/"+mesVencStr+"/") && parseInt(getVencReal(t).split("/")[0]) >= 20 ? "#991B1B" : getVencReal(t).includes("/"+mesVencStr+"/") ? "#92400E" : "#15803D",
                      fontWeight: 700, fontSize: 11, padding: "3px 8px", borderRadius: 6
                    }}>{getVencReal(t)}</span>
                  </td>
                  <td style={{ padding: "11px 14px" }}>
                    <span style={{ background: "#F1F5F9", color: "#475569", padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, fontFamily: "monospace" }}>{t.darf}</span>
                  </td>
                  <td style={{ padding: "8px 14px", minWidth: 150 }}>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", fontSize: 11, color: "#94A3B8", fontWeight: 600, pointerEvents: "none" }}>R$</span>
                      <input
                        type="text"
                        value={getValor(t.key)}
                        onChange={ev => setValor(t.key, ev.target.value)}
                        placeholder="0,00"
                        style={{
                          width: "100%", paddingLeft: 28, paddingRight: 8, paddingTop: 5, paddingBottom: 5,
                          border: `1.5px solid ${getValor(t.key) ? (pago ? "#BBF7D0" : "#FCD34D") : "#E2E8F0"}`,
                          borderRadius: 7, fontSize: 12, fontWeight: 700,
                          color: pago ? "#16A34A" : "#1E293B",
                          background: pago ? "#F0FDF4" : getValor(t.key) ? "#FFFBEB" : "white",
                          outline: "none", boxSizing: "border-box",
                          textAlign: "right", fontFamily: "monospace",
                          transition: "border-color 0.15s"
                        }}
                      />
                    </div>
                    {getValor(t.key) && (
                      <div style={{ fontSize: 10, color: pago ? "#16A34A" : "#64748B", marginTop: 2, textAlign: "right", fontWeight: 600 }}>
                        {fmtBRL(getValor(t.key))}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: "11px 14px" }}>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button onClick={() => !pago && togglePago(t.key)} style={{
                        padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: pago ? "default" : "pointer",
                        border: "none",
                        background: pago ? "#16A34A" : "#E2E8F0",
                        color: pago ? "white" : "#94A3B8",
                        transition: "all 0.15s"
                      }}>✓ Sim</button>
                      <button onClick={() => pago && togglePago(t.key)} style={{
                        padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: pago ? "pointer" : "default",
                        border: "none",
                        background: !pago ? "#DC2626" : "#E2E8F0",
                        color: !pago ? "white" : "#94A3B8",
                        transition: "all 0.15s"
                      }}>✗ Não</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          {totalRecolher > 0 && (
            <tfoot>
              <tr style={{ background: "#1E3A5F", color: "white" }}>
                <td colSpan={7} style={{ padding: "10px 14px", fontWeight: 800, fontSize: 12 }}>TOTAL APURADO</td>
                <td style={{ padding: "10px 14px", fontWeight: 800, fontSize: 13, fontFamily: "monospace", whiteSpace: "nowrap" }}>
                  <div>{totalRecolher.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</div>
                  {totalPago > 0 && <div style={{ fontSize: 10, opacity: 0.8, marginTop: 2 }}>✓ {totalPago.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} pago</div>}
                </td>
                <td style={{ padding: "10px 14px" }}>
                  {totalPendVal > 0
                    ? <span style={{ background: "#DC2626", color: "white", padding: "3px 10px", borderRadius: 8, fontSize: 11, fontWeight: 800, whiteSpace: "nowrap" }}>Pendente: {totalPendVal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                    : <span style={{ background: "#16A34A", color: "white", padding: "3px 10px", borderRadius: 8, fontSize: 11, fontWeight: 800 }}>✓ Pago integral</span>
                  }
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Linha do tempo de vencimentos */}
      <div style={{ background: "white", borderRadius: 12, border: "1px solid #E2E8F0", overflow: "hidden" }}>
        <div style={{ background: "#F8FAFC", borderBottom: "2px solid #E2E8F0", padding: "12px 20px", fontWeight: 800, fontSize: 14, color: "#1E293B" }}>
          🗓️ Linha do Tempo de Vencimentos — {mesVencNome}/{anoVencStr} (Competência {comp.label})
        </div>
        <div style={{ padding: 20 }}>
          {/* Régua visual */}
          <div style={{ position: "relative", marginBottom: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              {[1, 5, 10, 15, 20, 25, 31].map(d => (
                <span key={d} style={{ fontSize: 10, color: "#94A3B8", fontWeight: 600 }}>{d}</span>
              ))}
            </div>
            <div style={{ height: 8, background: "linear-gradient(90deg,#DCFCE7,#FEF3C7,#FEE2E2)", borderRadius: 99 }} />
            {[
              { dia: 15, label: `Dia 15/${mesVencStr}`, tributos: filtrados.filter(t => getDiaVenc(t) === 15), cor: "#D97706" },
              { dia: 20, label: `Dia 20/${mesVencStr}`, tributos: filtrados.filter(t => getDiaVenc(t) === 20), cor: "#DC2626" },
              { dia: ldVenc, label: `Dia ${ldVenc}/${mesVencStr}`, tributos: filtrados.filter(t => getDiaVenc(t) === ldVenc && getDiaVenc(t) !== 20 && getDiaVenc(t) !== 15), cor: "#2563EB" },
            ].filter(m => m.tributos.length > 0).map(m => {
              const leftPct = ((m.dia - 1) / 30) * 100;
              const todosPagesos = m.tributos.every(t => isPago(t.key));
              return (
                <div key={m.label} style={{ position: "absolute", left: `${leftPct}%`, top: -4, transform: "translateX(-50%)" }}>
                  <div style={{ width: 16, height: 16, borderRadius: "50%", background: todosPagesos ? "#16A34A" : m.cor, border: "2px solid white", boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }} />
                  <div style={{ position: "absolute", top: 20, left: "50%", transform: "translateX(-50%)", background: todosPagesos ? "#16A34A" : m.cor, color: "white", borderRadius: 6, padding: "3px 7px", fontSize: 10, fontWeight: 700, whiteSpace: "nowrap" }}>
                    {todosPagesos ? "✓ " : ""}{m.label}
                    <div style={{ fontWeight: 500, marginTop: 1 }}>{m.tributos.map(t => t.label).join(", ")}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cards agrupados por data */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 12, marginTop: 48 }}>
            {Object.entries(vencAgrupado).map(([venc, tribList]) => {
              const allPaid = tribList.every(t => isPago(t.key));
              const groupTotal = tribList.reduce((acc, t) => {
                const raw = getValor(t.key).toString().replace(/\./g, "").replace(",", ".");
                const n = parseFloat(raw);
                return acc + (isNaN(n) ? 0 : n);
              }, 0);
              return (
                <div key={venc} style={{ background: allPaid ? "#F0FDF4" : "#F8FAFC", borderRadius: 10, border: `1px solid ${allPaid ? "#BBF7D0" : "#E2E8F0"}`, padding: 14, transition: "all 0.2s" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: allPaid ? "#15803D" : "#1E3A5F", marginBottom: 8, borderBottom: `1px solid ${allPaid ? "#BBF7D0" : "#E2E8F0"}`, paddingBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>📅 {venc}</span>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      {groupTotal > 0 && <span style={{ fontSize: 11, fontWeight: 800, color: allPaid ? "#15803D" : "#DC2626", background: allPaid ? "#DCFCE7" : "#FEE2E2", padding: "1px 8px", borderRadius: 8 }}>{groupTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>}
                      {allPaid && <span style={{ fontSize: 12 }}>✅</span>}
                    </div>
                  </div>
                  {tribList.map(t => {
                    const gc = grupoColors[t.grupo] || { bg: "#F3F4F6", text: "#374151" };
                    const pago = isPago(t.key);
                    const val = getValor(t.key);
                    return (
                      <div key={t.key} style={{ marginBottom: 8, padding: "6px 8px", background: pago ? "#DCFCE7" : "white", borderRadius: 7, border: `1px solid ${pago ? "#BBF7D0" : "#F1F5F9"}`, transition: "all 0.2s" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: val ? 4 : 0 }}>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: pago ? "#64748B" : "#1E293B", textDecoration: pago ? "line-through" : "none" }}>{t.label}</div>
                            <div style={{ fontSize: 10, color: "#94A3B8" }}>{t.aliquota}</div>
                          </div>
                          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                            <span style={{ background: gc.bg, color: gc.text, fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 8 }}>{t.darf}</span>
                            <button onClick={() => togglePago(t.key)} title={pago ? "Clique para marcar como não pago" : "Clique para marcar como pago"}
                              style={{ padding: "3px 9px", borderRadius: 6, fontSize: 11, fontWeight: 800, cursor: "pointer", border: "none", background: pago ? "#16A34A" : "#DC2626", color: "white", transition: "all 0.15s" }}>
                              {pago ? "✓ Pago" : "✗ Pend."}
                            </button>
                          </div>
                        </div>
                        {val && (
                          <div style={{ fontSize: 12, fontWeight: 800, color: pago ? "#16A34A" : "#92400E", textAlign: "right", fontFamily: "monospace" }}>
                            {fmtBRL(val)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Certificados Digitais ─────────────────────────────────────────────────────
const certDataInicial = [
  { id: 1,  razao: "KE LTDA (Matriz)",               cnpj: "03.089.799/0001-22", venc: "2027-06-11", tipo: "e-CNPJ A3" },
  { id: 2,  razao: "KE LTDA (Filial)",                cnpj: "03.089.799/0004-75", venc: "2027-06-11", tipo: "e-CNPJ A3" },
  { id: 3,  razao: "KE LTDA (Filial)",                cnpj: "03.089.799/0005-56", venc: "2027-06-11", tipo: "e-CNPJ A3" },
  { id: 4,  razao: "TRE ECOMMERCE LTDA (Matriz)",     cnpj: "41.907.880/0001-61", venc: "2026-12-05", tipo: "e-CNPJ A3" },
  { id: 5,  razao: "TRE ECOMMERCE LTDA (Filial)",     cnpj: "41.907.880/0002-42", venc: "",           tipo: "e-CNPJ A3", pendente: true },
  { id: 6,  razao: "UNIQUE MIDIA LTDA.",              cnpj: "41.447.474/0001-63", venc: "2026-10-13", tipo: "e-CNPJ A3" },
  { id: 7,  razao: "FOUR ADMINISTRACAO DE BENS LTDA", cnpj: "41.562.411/0001-58", venc: "",           tipo: "e-CNPJ A3", naoPossui: true },
  { id: 8,  razao: "KE PARTICIPACOES LTDA",           cnpj: "50.421.483/0001-76", venc: "",           tipo: "e-CNPJ A3", naoPossui: true },
  { id: 9,  razao: "KMS LTDA",                        cnpj: "48.226.273/0001-85", venc: "",           tipo: "e-CNPJ A3", naoPossui: true },
  { id: 10, razao: "JNS LTDA",                        cnpj: "48.213.073/0001-98", venc: "",           tipo: "e-CNPJ A3", naoPossui: true },
  { id: 11, razao: "KVS LTDA",                        cnpj: "48.239.949/0001-75", venc: "",           tipo: "e-CNPJ A3", naoPossui: true },
];

// Data atual real
const HOJE_CERT = new Date(2026, 5, 24); // 24/06/2026

function diasParaVencerCert(vencISO) {
  if (!vencISO) return null;
  const dt = new Date(vencISO + "T00:00:00");
  if (isNaN(dt)) return null;
  const diff = dt - HOJE_CERT;
  return Math.round(diff / (1000 * 60 * 60 * 24));
}

function isoToBR(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function ModuloCertificados() {
  // Estado editável: { id: { venc, tipo, naoPossui, pendente } }
  const [certEdits, setCertEdits] = useState(() => {
    const init = {};
    certDataInicial.forEach(c => {
      init[c.id] = { venc: c.venc, tipo: c.tipo, naoPossui: !!c.naoPossui, pendente: !!c.pendente };
    });
    return init;
  });
  const [editingId, setEditingId] = useState(null);

  const getCert = (c) => ({ ...c, ...certEdits[c.id] });

  const updateCert = (id, field, value) => {
    setCertEdits(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const certs = certDataInicial.map(getCert);
  const comVenc = certs.filter(c => c.venc && !c.naoPossui);
  const pendentes = certs.filter(c => c.pendente && !c.naoPossui);
  const naoPossui = certs.filter(c => c.naoPossui);

  const getStatusCert = (c) => {
    if (c.naoPossui) return "naopossui";
    if (!c.venc) return "pendente";
    const d = diasParaVencerCert(c.venc);
    if (d === null) return "pendente";
    if (d <= 0)  return "expirado";
    if (d <= 30) return "critico";
    if (d <= 90) return "atencao";
    return "ok";
  };

  const certStatusStyle = {
    ok:        { bg: "#F0FDF4", text: "#15803D", badge: "#DCFCE7", badgeText: "#15803D", label: "✅ Válido",          barColor: "#16A34A" },
    atencao:   { bg: "#FFFBEB", text: "#92400E", badge: "#FEF3C7", badgeText: "#92400E", label: "⏳ < 90 dias",       barColor: "#FBBF24" },
    critico:   { bg: "#FFF5F5", text: "#991B1B", badge: "#FEE2E2", badgeText: "#991B1B", label: "⚠️ < 30 dias!",      barColor: "#F59E0B" },
    expirado:  { bg: "#FEF2F2", text: "#7F1D1D", badge: "#DC2626",  badgeText: "white",  label: "🚨 Expirado",        barColor: "#DC2626" },
    pendente:  { bg: "#F0F9FF", text: "#0369A1", badge: "#DBEAFE", badgeText: "#1D4ED8", label: "📋 Pendente",        barColor: "#3B82F6" },
    naopossui: { bg: "#F8FAFC", text: "#94A3B8", badge: "#F1F5F9", badgeText: "#64748B", label: "— Não possui",       barColor: "#CBD5E1" },
  };

  const alertas30 = comVenc.filter(c => { const d = diasParaVencerCert(c.venc); return d !== null && d <= 30 && d > 0; });
  const expirados = comVenc.filter(c => { const d = diasParaVencerCert(c.venc); return d !== null && d <= 0; });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 8 }}>
        <div>
          <h2 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700 }}>🔐 Vencimento de Certificados Digitais</h2>
          <div style={{ fontSize: 12, color: "#64748B" }}>
            Data de referência: <strong>24/06/2026</strong> · Alerta automático para vencimentos ≤ 30 dias
          </div>
        </div>
        <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 10, padding: "8px 14px", fontSize: 12, color: "#1D4ED8", fontWeight: 600 }}>
          💡 Clique em qualquer linha para editar o vencimento
        </div>
      </div>

      {/* Alertas */}
      {(alertas30.length > 0 || expirados.length > 0) && (
        <div style={{ marginBottom: 20 }}>
          {expirados.map(c => (
            <div key={c.id} style={{ background: "#FEF2F2", border: "2px solid #DC2626", borderRadius: 12, padding: "14px 20px", marginBottom: 10, display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 28 }}>🚨</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 14, color: "#7F1D1D" }}>CERTIFICADO EXPIRADO — {c.razao}</div>
                <div style={{ fontSize: 12, color: "#991B1B", marginTop: 2 }}>{c.cnpj} · Venceu em {isoToBR(c.venc)} · Renovação urgente necessária</div>
              </div>
              <span style={{ background: "#DC2626", color: "white", fontWeight: 800, fontSize: 12, padding: "4px 14px", borderRadius: 20 }}>EXPIRADO</span>
            </div>
          ))}
          {alertas30.map(c => {
            const d = diasParaVencerCert(c.venc);
            return (
              <div key={c.id} style={{ background: "#FFFBEB", border: "2px solid #F59E0B", borderRadius: 12, padding: "14px 20px", marginBottom: 10, display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ fontSize: 28 }}>⚠️</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 14, color: "#92400E" }}>ALERTA — {c.razao}</div>
                  <div style={{ fontSize: 12, color: "#B45309", marginTop: 2 }}>{c.cnpj} · Vence em {isoToBR(c.venc)} · Faltam <strong>{d} dia{d !== 1 ? "s" : ""}</strong></div>
                </div>
                <span style={{ background: "#F59E0B", color: "white", fontWeight: 800, fontSize: 12, padding: "4px 14px", borderRadius: 20 }}>VENCE EM {d}d</span>
              </div>
            );
          })}
        </div>
      )}

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Com certificado", value: comVenc.length, bg: "#DCFCE7", color: "#15803D", icon: "✅" },
          { label: "Alerta ≤ 30 dias", value: alertas30.length, bg: alertas30.length > 0 ? "#FEE2E2" : "#F1F5F9", color: alertas30.length > 0 ? "#DC2626" : "#94A3B8", icon: "⚠️" },
          { label: "Pendente", value: pendentes.length, bg: "#DBEAFE", color: "#1D4ED8", icon: "📋" },
          { label: "Não possui", value: naoPossui.length, bg: "#F1F5F9", color: "#64748B", icon: "—" },
        ].map(k => (
          <div key={k.label} style={{ background: k.bg, borderRadius: 12, padding: "14px 16px", textAlign: "center" }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{k.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: k.color }}>{k.value}</div>
            <div style={{ fontSize: 11, color: k.color, fontWeight: 600, marginTop: 2 }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Tabela principal editável */}
      <div style={{ background: "white", borderRadius: 12, border: "1px solid #E2E8F0", overflow: "hidden", marginBottom: 24 }}>
        <div style={{ background: "#1E3A5F", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "white", fontWeight: 800, fontSize: 14 }}>🔐 Certificados Digitais — Carteira Completa</span>
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>✏️ Clique na linha para editar</span>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#F8FAFC", borderBottom: "2px solid #E2E8F0" }}>
              {["Empresa", "CNPJ", "Tipo", "Vencimento", "Dias Restantes", "Status", "Ações"].map(h => (
                <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontWeight: 700, color: "#374151", fontSize: 12 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {certs.map((c, i) => {
              const st = getStatusCert(c);
              const stStyle = certStatusStyle[st];
              const dias = diasParaVencerCert(c.venc);
              const isEditing = editingId === c.id;
              const edit = certEdits[c.id];

              return (
                <tr key={c.id} style={{ borderBottom: "1px solid #F1F5F9", background: isEditing ? "#F0F9FF" : stStyle.bg, cursor: "pointer", transition: "background 0.15s" }}
                  onClick={() => setEditingId(isEditing ? null : c.id)}>

                  {/* Empresa */}
                  <td style={{ padding: "12px 16px", fontWeight: 700, color: "#1E293B" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      {isEditing && <span style={{ fontSize: 10, color: "#2563EB" }}>✏️</span>}
                      {c.razao}
                    </div>
                  </td>

                  {/* CNPJ */}
                  <td style={{ padding: "12px 16px", color: "#64748B", fontSize: 12, fontFamily: "monospace" }}>{c.cnpj}</td>

                  {/* Tipo */}
                  <td style={{ padding: "12px 16px" }} onClick={e => isEditing && e.stopPropagation()}>
                    {isEditing ? (
                      <select value={edit.tipo} onChange={e => updateCert(c.id, "tipo", e.target.value)}
                        style={{ border: "1.5px solid #2563EB", borderRadius: 6, padding: "4px 8px", fontSize: 12, fontWeight: 600, color: "#1E293B", background: "white", cursor: "pointer" }}>
                        {["e-CNPJ A1", "e-CNPJ A3", "e-CPF A1", "e-CPF A3", "NF-e A1", "NF-e A3"].map(t => <option key={t}>{t}</option>)}
                      </select>
                    ) : (
                      <span style={{ background: "#EDE9FE", color: "#5B21B6", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 8 }}>{c.tipo}</span>
                    )}
                  </td>

                  {/* Vencimento — campo editável */}
                  <td style={{ padding: "12px 16px" }} onClick={e => isEditing && e.stopPropagation()}>
                    {isEditing ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <input
                          type="date"
                          value={edit.venc}
                          onChange={e => {
                            updateCert(c.id, "venc", e.target.value);
                            if (e.target.value) {
                              updateCert(c.id, "pendente", false);
                              updateCert(c.id, "naoPossui", false);
                            }
                          }}
                          style={{ border: "1.5px solid #2563EB", borderRadius: 6, padding: "4px 8px", fontSize: 12, color: "#1E293B", background: "white", cursor: "pointer", width: 150 }}
                        />
                        <div style={{ display: "flex", gap: 4 }}>
                          <label style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, color: "#64748B", cursor: "pointer" }}>
                            <input type="checkbox" checked={edit.pendente} onChange={e => { updateCert(c.id, "pendente", e.target.checked); if (e.target.checked) { updateCert(c.id, "venc", ""); updateCert(c.id, "naoPossui", false); } }} />
                            Pendente
                          </label>
                          <label style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, color: "#64748B", cursor: "pointer" }}>
                            <input type="checkbox" checked={edit.naoPossui} onChange={e => { updateCert(c.id, "naoPossui", e.target.checked); if (e.target.checked) { updateCert(c.id, "venc", ""); updateCert(c.id, "pendente", false); } }} />
                            Não possui
                          </label>
                        </div>
                      </div>
                    ) : (
                      <span style={{ fontWeight: 700, color: stStyle.text }}>
                        {c.venc ? isoToBR(c.venc) : <span style={{ color: "#CBD5E1", fontWeight: 400 }}>—</span>}
                      </span>
                    )}
                  </td>

                  {/* Dias Restantes */}
                  <td style={{ padding: "12px 16px", textAlign: "center" }}>
                    {dias !== null ? (
                      <span style={{ background: stStyle.badge, color: stStyle.badgeText, fontWeight: 800, fontSize: 12, padding: "3px 14px", borderRadius: 20, whiteSpace: "nowrap", display: "inline-block" }}>
                        {dias > 0 ? `${dias} dias` : "Expirado"}
                      </span>
                    ) : <span style={{ color: "#CBD5E1" }}>—</span>}
                  </td>

                  {/* Status */}
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ background: stStyle.badge, color: stStyle.badgeText, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 8 }}>
                      {stStyle.label}
                    </span>
                  </td>

                  {/* Ações */}
                  <td style={{ padding: "12px 16px" }} onClick={e => e.stopPropagation()}>
                    {isEditing ? (
                      <button onClick={() => setEditingId(null)}
                        style={{ background: "#16A34A", color: "white", border: "none", borderRadius: 7, padding: "5px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                        ✓ Salvar
                      </button>
                    ) : (
                      <button onClick={() => setEditingId(c.id)}
                        style={{ background: "#EFF6FF", color: "#1D4ED8", border: "1.5px solid #BFDBFE", borderRadius: 7, padding: "5px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                        ✏️ Editar
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Linha do tempo */}
      <div style={{ background: "white", borderRadius: 12, border: "1px solid #E2E8F0", overflow: "hidden" }}>
        <div style={{ background: "#F8FAFC", borderBottom: "2px solid #E2E8F0", padding: "12px 20px", fontWeight: 700, fontSize: 13, color: "#1E293B" }}>
          📅 Linha do Tempo — Próximos Vencimentos (ordenado por data)
        </div>
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
          {[...comVenc]
            .sort((a, b) => new Date(a.venc) - new Date(b.venc))
            .map(c => {
              const st = getStatusCert(c);
              const stStyle = certStatusStyle[st];
              const dias = diasParaVencerCert(c.venc);
              const refDias = 1095; // ~3 anos = escala visual
              const barPct = Math.min(100, Math.max(2, (Math.max(0, dias) / refDias) * 100));
              return (
                <div key={c.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                    <div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#1E293B" }}>{c.razao}</span>
                      <span style={{ fontSize: 11, color: "#94A3B8", marginLeft: 8 }}>{c.cnpj}</span>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 11, color: "#64748B" }}>Vence: <strong>{isoToBR(c.venc)}</strong></span>
                      <span style={{ background: stStyle.badge, color: stStyle.badgeText, fontSize: 10, fontWeight: 800, padding: "2px 10px", borderRadius: 12, whiteSpace: "nowrap" }}>
                        {dias > 0 ? `${dias}d` : "Expirado"}
                      </span>
                    </div>
                  </div>
                  <div style={{ height: 10, background: "#E2E8F0", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${barPct}%`, borderRadius: 99, background: stStyle.barColor, transition: "width 0.5s" }} />
                  </div>
                </div>
              );
            })}
          {pendentes.length > 0 && (
            <div style={{ marginTop: 8, padding: "12px 16px", background: "#EFF6FF", borderRadius: 10, border: "1px solid #BFDBFE" }}>
              <div style={{ fontWeight: 700, fontSize: 12, color: "#1D4ED8", marginBottom: 6 }}>📋 Certificado pendente de providência:</div>
              {pendentes.map(c => <div key={c.id} style={{ fontSize: 12, color: "#1E40AF" }}>• {c.razao} — {c.cnpj}</div>)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Resumo Executivo ──────────────────────────────────────────────────────────
function PendingList({ tasks, statuses, empresaId, onNavigate }) {
  const aFazer = tasks.filter(t => (statuses[`${empresaId}_${t.key}`] || "A Fazer") === "A Fazer");
  const andamento = tasks.filter(t => (statuses[`${empresaId}_${t.key}`] || "A Fazer") === "Em Andamento");
  if (aFazer.length === 0 && andamento.length === 0) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", background: "#F0FDF4", borderRadius: 8, border: "1px solid #BBF7D0" }}>
        <span>🎉</span><span style={{ fontSize: 12, fontWeight: 700, color: "#15803D" }}>Todas as obrigações entregues!</span>
      </div>
    );
  }
  const renderItem = (t, status) => {
    const c = catColors[t.tipo];
    const isBg = status === "Em Andamento";
    const modKey = t.tipo === "acessoria" ? "modulo1" : t.tipo === "contabil" ? "modulo2" : "modulo3";
    return (
      <div key={t.key} style={{ display: "flex", alignItems: "center", gap: 6, background: isBg ? "#DBEAFE" : "#FEE2E2", border: `1px solid ${isBg ? "#93C5FD" : "#FECACA"}`, borderRadius: 7, padding: "4px 8px" }}>
        <span style={{ fontSize: 10, fontWeight: 600, color: isBg ? "#1E40AF" : "#991B1B", flex: 1 }}>{c.icon} {t.label}</span>
        <button
          onClick={(ev) => { ev.stopPropagation(); onNavigate(modKey, empresaId); }}
          title="Ir para esta obrigação"
          style={{ background: isBg ? "#1D4ED8" : "#DC2626", color: "white", border: "none", borderRadius: 5, padding: "2px 7px", fontSize: 9, fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap" }}
        >→ Abrir</button>
      </div>
    );
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {andamento.length > 0 && (
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, color: "#1D4ED8", textTransform: "uppercase", marginBottom: 4 }}>Em andamento</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>{andamento.map(t => renderItem(t, "Em Andamento"))}</div>
        </div>
      )}
      {aFazer.length > 0 && (
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, color: "#DC2626", textTransform: "uppercase", marginBottom: 4 }}>Pendente / A fazer</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>{aFazer.map(t => renderItem(t, "A Fazer"))}</div>
        </div>
      )}
    </div>
  );
}

function ResumoExecutivo({ statuses, onNavigate, comp }) {
  const [expandedId, setExpandedId] = useState(null);
  const [sortBy, setSortBy] = useState("pendente");

  const allData = empresas.map(e => {
    const tasks = getAllTasks(e);
    const prog = getProgress(tasks, statuses, e.id);
    return { e, tasks, prog };
  });
  const sorted = [...allData].sort((a, b) => {
    if (sortBy === "pendente") return b.prog.pendente - a.prog.pendente;
    if (sortBy === "pct_asc") return a.prog.pct - b.prog.pct;
    if (sortBy === "pct_desc") return b.prog.pct - a.prog.pct;
    return a.e.razao.localeCompare(b.e.razao);
  });
  const totalGeral = allData.reduce((s, d) => s + d.prog.total, 0);
  const totalEntregue = allData.reduce((s, d) => s + d.prog.entregue, 0);
  const totalAndamento = allData.reduce((s, d) => s + d.prog.andamento, 0);
  const totalPendente = allData.reduce((s, d) => s + d.prog.pendente, 0);
  const pctGeral = Math.round(((totalEntregue + totalAndamento * 0.5) / totalGeral) * 100);

  return (
    <div>
      <h2 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 700 }}>📈 Resumo Executivo — Carteira {comp.label}</h2>

      {/* KPI geral */}
      <div style={{ background: "white", borderRadius: 12, border: "1px solid #E2E8F0", padding: 20, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>Progresso Geral da Carteira</div>
            <div style={{ fontSize: 11, color: "#94A3B8" }}>{empresas.length} empresas · {totalGeral} obrigações</div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            {[{ label: "Entregues", value: totalEntregue, color: "#16A34A", bg: "#DCFCE7" },
              { label: "Em Andamento", value: totalAndamento, color: "#2563EB", bg: "#DBEAFE" },
              { label: "Pendentes", value: totalPendente, color: "#DC2626", bg: "#FEE2E2" }].map(k => (
              <div key={k.label} style={{ textAlign: "center", background: k.bg, borderRadius: 10, padding: "6px 14px" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: k.color }}>{k.value}</div>
                <div style={{ fontSize: 10, color: k.color, fontWeight: 600 }}>{k.label}</div>
              </div>
            ))}
          </div>
        </div>
        <ProgressRuler pct={pctGeral} entregue={totalEntregue} andamento={totalAndamento} pendente={totalPendente} total={totalGeral} />
      </div>

      {/* Prazos críticos */}
      <div style={{ background: "white", borderRadius: 12, border: "1px solid #E2E8F0", marginBottom: 20, overflow: "hidden" }}>
        <div style={{ background: "linear-gradient(90deg,#DC2626,#EF4444)", padding: "12px 20px", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>🔴</span>
          <span style={{ color: "white", fontWeight: 800, fontSize: 14 }}>5 Prazos Mais Críticos — {comp.label}</span>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#FEF2F2", borderBottom: "2px solid #FECACA" }}>
              {["#", "Empresa(s)", "Obrigação", "Vencimento", "Dias", "Categoria"].map(h => (
                <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontWeight: 700, color: "#991B1B", fontSize: 12 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {getPrazoscriticos(comp).map((p, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #FEE2E2" }}>
                <td style={{ padding: "11px 16px", fontWeight: 800, color: "#DC2626", fontSize: 16 }}>{i + 1}°</td>
                <td style={{ padding: "11px 16px", fontWeight: 600 }}>{p.empresa}</td>
                <td style={{ padding: "11px 16px", color: "#374151" }}>{p.obrigacao}</td>
                <td style={{ padding: "11px 16px" }}>
                  <span style={{ background: p.dias <= 7 ? "#FEE2E2" : "#FEF3C7", color: p.dias <= 7 ? "#991B1B" : "#92400E", fontWeight: 700, borderRadius: 6, padding: "3px 10px", fontSize: 12 }}>{p.venc}</span>
                </td>
                <td style={{ padding: "11px 16px", textAlign: "center" }}>
                  <span style={{ background: p.dias <= 7 ? "#DC2626" : "#F59E0B", color: "white", fontWeight: 800, borderRadius: 20, padding: "3px 12px", fontSize: 12 }}>{p.dias}d</span>
                </td>
                <td style={{ padding: "11px 16px" }}><CatTag tipo={p.tipo} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Régua por empresa */}
      <div style={{ background: "white", borderRadius: 12, border: "1px solid #E2E8F0", overflow: "hidden" }}>
        <div style={{ background: "#F8FAFC", borderBottom: "2px solid #E2E8F0", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <div style={{ fontWeight: 800, fontSize: 14 }}>📏 Régua de Acompanhamento por Empresa</div>
          <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, color: "#64748B", fontWeight: 600 }}>Ordenar:</span>
            {[{ key: "pendente", label: "Mais pendentes" }, { key: "pct_asc", label: "Menos avançado" }, { key: "pct_desc", label: "Mais avançado" }, { key: "nome", label: "Nome" }].map(s => (
              <button key={s.key} onClick={() => setSortBy(s.key)} style={{
                padding: "3px 10px", borderRadius: 14, fontSize: 11, fontWeight: 600,
                border: `1.5px solid ${sortBy === s.key ? "#2563EB" : "#E2E8F0"}`,
                background: sortBy === s.key ? "#EFF6FF" : "white",
                color: sortBy === s.key ? "#1D4ED8" : "#64748B", cursor: "pointer"
              }}>{s.label}</button>
            ))}
          </div>
        </div>
        {/* Legenda */}
        <div style={{ padding: "8px 20px", background: "#FAFAFA", borderBottom: "1px solid #F1F5F9", display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
          {[{ color: "#16A34A", label: "Entregue" }, { stripe: true, label: "Em andamento" }, { color: "#E2E8F0", label: "Pendente" }].map(l => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 20, height: 8, borderRadius: 4, background: l.stripe ? "repeating-linear-gradient(45deg,#2563EB 0,#2563EB 4px,#3B82F6 4px,#3B82F6 8px)" : l.color }} />
              <span style={{ fontSize: 10, color: "#64748B" }}>{l.label}</span>
            </div>
          ))}
          <span style={{ fontSize: 10, color: "#64748B", marginLeft: 8 }}>💡 Clique em uma empresa para ver pendências com botões de navegação direta</span>
        </div>

        <div>
          {sorted.map(({ e, tasks, prog }, idx) => {
            const isExpanded = expandedId === e.id;
            const alertLevel = prog.pct === 100 ? "done" : prog.pct < 40 ? "warning" : prog.pct < 80 ? "ok" : "done";
            const borderColor = prog.pct === 0 ? "#DC2626" : prog.pct < 40 ? "#F59E0B" : prog.pct < 80 ? "#2563EB" : "#16A34A";

            return (
              <div key={e.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                <div onClick={() => setExpandedId(isExpanded ? null : e.id)}
                  style={{ padding: "14px 20px", cursor: "pointer", background: isExpanded ? "#F0F9FF" : idx % 2 === 0 ? "white" : "#FAFAFA", borderLeft: `4px solid ${borderColor}`, transition: "background 0.15s" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <div style={{ minWidth: 220, flex: "0 0 220px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 12, fontWeight: 700 }}>{e.razao}</span>
                        {prog.pct === 100 && <span>✅</span>}
                        {prog.pendente > 0 && prog.pct < 30 && <span>⚠️</span>}
                      </div>
                      <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 1 }}>{e.cnpj}</div>
                      <div style={{ marginTop: 4 }}><Badge regime={e.regime} /></div>
                    </div>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <ProgressRuler pct={prog.pct} entregue={prog.entregue} andamento={prog.andamento} pendente={prog.pendente} total={prog.total} />
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      {[{ label: "ENTREGUE", value: prog.entregue, bg: "#DCFCE7", color: "#16A34A" },
                        { label: "ANDAMENTO", value: prog.andamento, bg: "#DBEAFE", color: "#2563EB" },
                        { label: "PENDENTE", value: prog.pendente, bg: "#FEE2E2", color: "#DC2626" }].map(k => (
                        <div key={k.label} style={{ textAlign: "center", background: k.bg, borderRadius: 8, padding: "4px 10px", minWidth: 44 }}>
                          <div style={{ fontSize: 16, fontWeight: 800, color: k.color }}>{k.value}</div>
                          <div style={{ fontSize: 9, color: k.color, fontWeight: 700 }}>{k.label}</div>
                        </div>
                      ))}
                      <span style={{ color: "#94A3B8", fontSize: 16 }}>{isExpanded ? "▲" : "▼"}</span>
                    </div>
                  </div>
                </div>
                {isExpanded && (
                  <div style={{ padding: "14px 20px 16px 28px", background: "#F8FAFC", borderTop: "1px dashed #E2E8F0" }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: "#475569", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>
                      Pendências de {e.razao} — {prog.total} obrigações totais
                    </div>
                    <PendingList tasks={tasks} statuses={statuses} empresaId={e.id} onNavigate={onNavigate} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Rodapé */}
        <div style={{ background: "#1E3A5F", color: "white", padding: "16px 20px", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 12 }}>
          {[
            { label: "Total de Empresas", value: empresas.length },
            { label: "Lucro Presumido", value: empresas.filter(e => e.regime === "Lucro Presumido").length },
            { label: "Simples Nacional", value: empresas.filter(e => e.regime === "Simples Nacional").length },
            { label: "Com Folha", value: empresas.filter(e => e.folha).length },
            { label: "Total Obrigações/mês", value: totalGeral },
          ].map(item => (
            <div key={item.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 800 }}>{item.value}</div>
              <div style={{ fontSize: 11, opacity: 0.8 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function PainelGestaoContabil() {
  // UI-local (não precisa sincronizar)
  const [activeTab, setActiveTab]           = useState("modulo1");
  const [activeEmpresa, setActiveEmpresa]   = useState(0);
  const [filterRegime, setFilterRegime]     = useState("Todos");

  // Compartilhados em tempo real via Supabase
  const [statuses,       setStatuses]       = useSync("statuses",      {});
  const [responsaveis,   setResponsaveis]   = useSync("responsaveis",  {});
  const [pagamentos,     setPagamentos]     = useSync("pagamentos",     {});
  const [valores,        setValores]        = useSync("valores",        {});
  const [competenciaKey, setCompetenciaKey] = useSync("competencia",   "2026-07");

  const comp = getCompetencia(competenciaKey);
  const MONTH = comp.label;

  // Indicador de sincronização
  const [syncStatus, setSyncStatus] = useState("synced"); // "synced" | "saving" | "error"

  const empresa = empresas[activeEmpresa];
  const getStatus = (key) => statuses[`${empresa.id}_${key}`] || "A Fazer";
  const setStatus = (key, val) => setStatuses(prev => ({ ...prev, [`${empresa.id}_${key}`]: val }));
  const getResp = (key) => responsaveis[`${empresa.id}_${key}`] || "";
  const setResp = (key, val) => setResponsaveis(prev => ({ ...prev, [`${empresa.id}_${key}`]: val }));
  const temFolha = empresa.folha;
  const filteredEmpresas = filterRegime === "Todos" ? empresas : empresas.filter(e => e.regime === filterRegime);

  // Navigate from Resumo → modulo, pre-selecting the right company
  const handleNavigate = (modKey, empresaId) => {
    const idx = empresas.findIndex(e => e.id === empresaId);
    if (idx >= 0) setActiveEmpresa(idx);
    setActiveTab(modKey);
  };

  const tabs = [
    { key: "modulo1", label: "📋 Obrigações Acessórias" },
    { key: "modulo2", label: "📊 Fechamento Contábil" },
    { key: "modulo3", label: "👥 Folha / DP" },
    { key: "modulo4", label: "🗓️ Painel Unificado" },
    { key: "impostos", label: "💰 Vencimento de Impostos" },
    { key: "certdigital", label: "🔐 Certificados Digitais" },
    { key: "resumo", label: "📈 Resumo Executivo" },
  ];

  return (
    <div style={{ fontFamily: "'Inter',-apple-system,sans-serif", background: "#F8FAFC", minHeight: "100vh", color: "#1E293B" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg,#1E3A5F 0%,#2563EB 100%)", color: "white", padding: "20px 28px 0" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ background: "white", borderRadius: 10, padding: 6, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
                <img src={LOGO_B64} alt="KE Logo" style={{ height: 48, width: 48, objectFit: "contain", borderRadius: 6 }} />
              </div>
              <div>
                <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", opacity: 0.7, marginBottom: 4 }}>Escritório de Contabilidade</div>
                <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Painel Unificado de Gestão Contábil</h1>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
                  <span style={{ fontSize: 13, opacity: 0.8 }}>{empresas.length} empresas na carteira</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(255,255,255,0.15)", borderRadius: 20, padding: "2px 10px", fontSize: 10, fontWeight: 700 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ADE80", display: "inline-block", animation: "pulse 2s infinite" }} />
                    🔄 ONLINE · Sync em tempo real
                  </span>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-end" }}>
              {/* Seletor de Competência */}
              <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: "10px 14px" }}>
                <div style={{ fontSize: 10, opacity: 0.7, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, fontWeight: 700 }}>Competência</div>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "flex-end" }}>
                  {COMPETENCIAS.map(c => (
                    <button key={c.key} onClick={() => { setCompetenciaKey(c.key); setStatuses({}); setResponsaveis({}); }} style={{
                      padding: "4px 11px", borderRadius: 16, fontSize: 11, fontWeight: 700, cursor: "pointer",
                      border: `2px solid ${competenciaKey === c.key ? "white" : "rgba(255,255,255,0.3)"}`,
                      background: competenciaKey === c.key ? "white" : "transparent",
                      color: competenciaKey === c.key ? "#1E3A5F" : "rgba(255,255,255,0.85)",
                      transition: "all 0.15s"
                    }}>{c.label.replace("/2026","").replace("Julho","Jul").replace("Agosto","Ago").replace("Setembro","Set").replace("Outubro","Out").replace("Novembro","Nov").replace("Dezembro","Dez")}</button>
                  ))}
                </div>
              </div>
              {/* Contadores regime */}
              <div style={{ display: "flex", gap: 10 }}>
                {["Lucro Presumido", "Simples Nacional"].map(r => (
                  <div key={r} style={{ background: "rgba(255,255,255,0.12)", borderRadius: 10, padding: "8px 14px", textAlign: "center" }}>
                    <div style={{ fontSize: 20, fontWeight: 800 }}>{empresas.filter(e => e.regime === r).length}</div>
                    <div style={{ fontSize: 10, opacity: 0.85 }}>{r}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 2, marginTop: 16, flexWrap: "wrap" }}>
            {tabs.map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
                background: activeTab === t.key ? "white" : "transparent",
                color: activeTab === t.key ? "#1E3A5F" : "rgba(255,255,255,0.8)",
                border: "none", cursor: "pointer", padding: "8px 16px", borderRadius: "8px 8px 0 0",
                fontWeight: activeTab === t.key ? 700 : 500, fontSize: 12, transition: "all 0.15s"
              }}>{t.label}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px 28px" }}>

        {/* Banner de competência ativa */}
        <div style={{ background: "linear-gradient(90deg,#EFF6FF,#DBEAFE)", border: "1px solid #BFDBFE", borderRadius: 10, padding: "10px 18px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 16 }}>📅</span>
          <span style={{ fontWeight: 700, color: "#1E3A5F", fontSize: 13 }}>Competência ativa:</span>
          <span style={{ fontWeight: 800, color: "#2563EB", fontSize: 15 }}>{MONTH}</span>
          <span style={{ color: "#64748B", fontSize: 12 }}>· Ref. mês anterior: {comp.mesComp}</span>
          {comp.trimestreLabel && <span style={{ background: "#EDE9FE", color: "#5B21B6", fontWeight: 700, fontSize: 11, padding: "2px 10px", borderRadius: 10 }}>🔷 {comp.trimestreLabel} — Trimestral</span>}
          {comp.mes === 7 && <span style={{ background: "#FEE2E2", color: "#991B1B", fontWeight: 700, fontSize: 11, padding: "2px 10px", borderRadius: 10 }}>⚠️ ECF — Vencimento anual</span>}
        </div>

        {/* Seletor empresa (módulos 1-3) */}
        {["modulo1", "modulo2", "modulo3"].includes(activeTab) && (
          <div style={{ background: "white", borderRadius: 12, padding: 16, marginBottom: 20, border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <span style={{ fontWeight: 600, fontSize: 13, color: "#64748B" }}>Empresa:</span>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", flex: 1 }}>
              {empresas.map((e, i) => (
                <button key={e.id} onClick={() => setActiveEmpresa(i)} style={{
                  padding: "5px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                  border: `2px solid ${activeEmpresa === i ? "#2563EB" : "#E2E8F0"}`,
                  background: activeEmpresa === i ? "#EFF6FF" : "white",
                  color: activeEmpresa === i ? "#1D4ED8" : "#64748B", cursor: "pointer"
                }}>{e.razao.length > 28 ? e.razao.slice(0, 28) + "…" : e.razao}</button>
              ))}
            </div>
          </div>
        )}

        {/* MÓDULO 1 */}
        {activeTab === "modulo1" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Módulo 1 — Calendário de Obrigações Acessórias</h2>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                  <span style={{ fontSize: 13, color: "#64748B" }}>{empresa.razao}</span>
                  <Badge regime={empresa.regime} />
                </div>
              </div>
            </div>
            <div style={{ background: "white", borderRadius: 12, border: "1px solid #E2E8F0", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#F8FAFC", borderBottom: "2px solid #E2E8F0" }}>
                    {["Obrigação", "Periodicidade", "Vencimento / Entrega", "Órgão", "Status"].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, color: "#374151", fontSize: 12 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {obrigacoesConfig.map((ob, i) => {
                    const aplica = ob.checkFn(empresa);
                    return (
                      <tr key={ob.key} style={{ borderBottom: "1px solid #F1F5F9", background: i % 2 === 0 ? "white" : "#FAFAFA", opacity: aplica ? 1 : 0.45 }}>
                        <td style={{ padding: "11px 16px", fontWeight: 600, color: aplica ? "#1E293B" : "#94A3B8" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ width: 8, height: 8, borderRadius: "50%", background: aplica ? "#1E40AF" : "#CBD5E1", display: "inline-block" }} />
                            {ob.label}
                          </div>
                        </td>
                        <td style={{ padding: "11px 16px", color: "#64748B" }}>{ob.periodicidade}</td>
                        <td style={{ padding: "11px 16px", color: "#64748B", fontSize: 12 }}>{ob.venc}</td>
                        <td style={{ padding: "11px 16px", color: "#64748B", fontSize: 12 }}>{ob.orgao}</td>
                        <td style={{ padding: "11px 16px" }}>
                          {aplica ? <StatusBadge status={getStatus(ob.key)} onChange={v => setStatus(ob.key, v)} />
                            : <span style={{ color: "#CBD5E1", fontSize: 12 }}>N/A</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MÓDULO 2 */}
        {activeTab === "modulo2" && (
          <div>
            <h2 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 700 }}>Módulo 2 — Planejamento de Fechamento Contábil</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <span style={{ fontSize: 13, color: "#64748B" }}>{empresa.razao}</span>
              <Badge regime={empresa.regime} />
            </div>
            <div style={{ background: "white", borderRadius: 12, border: "1px solid #E2E8F0", overflow: "hidden" }}>
              <div style={{ background: "FFFBEB", borderBottom: "1px solid #FDE68A", padding: "10px 16px", fontSize: 12, color: "#92400E", fontWeight: 600 }}>📊 Cronograma de Fechamento — {MONTH}</div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#F8FAFC", borderBottom: "2px solid #E2E8F0" }}>
                    {["Etapa", "Data Limite", "Responsável", "Status"].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, color: "#374151", fontSize: 12 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {fechamentoTasks.map((t, i) => {
                    const stKey = `fech_${t.key}`;
                    const st = getStatus(stKey);
                    const isDone = st === "Entregue";
                    const isDRE = t.destaque;
                    const dataLabel = fmtData(t.dia, comp.mes, comp.ano);
                    return (
                    <tr key={t.key} style={{ borderBottom: "1px solid #F1F5F9", background: isDone ? "#F0FDF4" : isDRE ? "#FDF4FF" : i % 2 === 0 ? "white" : "#FAFAFA", borderLeft: isDRE ? "4px solid #7C3AED" : "4px solid transparent" }}>
                      <td style={{ padding: "12px 16px", fontWeight: 600 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, background: isDone ? "#16A34A" : st === "Em Andamento" ? "#2563EB" : isDRE ? "#7C3AED" : "#F59E0B", display: "inline-block" }} />
                          <span style={{ background: isDRE ? "#EDE9FE" : "#FEF9C3", color: isDRE ? "#5B21B6" : "#713F12", borderRadius: 6, padding: "2px 8px", fontWeight: 800, fontSize: 12 }}>{String(t.dia).padStart(2,"0")}/{String(comp.mes).padStart(2,"0")}</span>
                          <span style={{ textDecoration: isDone ? "line-through" : "none", color: isDone ? "#94A3B8" : isDRE ? "#5B21B6" : "#1E293B", fontWeight: isDRE ? 700 : 600 }}>{t.label}</span>
                          {isDRE && !isDone && <span style={{ background: "#EDE9FE", color: "#5B21B6", fontSize: 10, fontWeight: 800, padding: "1px 8px", borderRadius: 10 }}>📊 DRE Gerencial</span>}
                          {isDone && <span style={{ fontSize: 13 }}>✅</span>}
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px", color: "#64748B" }}>Até {dataLabel}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <input value={getResp(stKey)} onChange={e => setResp(stKey, e.target.value)} placeholder="Responsável..."
                          style={{ border: "1px solid #E2E8F0", borderRadius: 6, padding: "4px 10px", fontSize: 12, width: "100%", background: "#F8FAFC" }} />
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <StatusBadge status={st} onChange={v => setStatus(stKey, v)} />
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MÓDULO 3 */}
        {activeTab === "modulo3" && (
          <div>
            <h2 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 700 }}>Módulo 3 — Calendário de Folha de Pagamento / DP</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <span style={{ fontSize: 13, color: "#64748B" }}>{empresa.razao}</span>
              <Badge regime={empresa.regime} />
              {!temFolha && <span style={{ background: "#FEE2E2", color: "#991B1B", padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 700 }}>⚠️ Sem folha</span>}
            </div>
            {!temFolha ? (
              <div style={{ background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 12, padding: 24, textAlign: "center", color: "#C2410C" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>Empresa sem folha de pagamento ativa</div>
                <div style={{ fontSize: 13, marginTop: 4, color: "#92400E" }}>As obrigações de DP não se aplicam a esta empresa.</div>
              </div>
            ) : (
              <div style={{ background: "white", borderRadius: 12, border: "1px solid #E2E8F0", overflow: "hidden" }}>
                <div style={{ background: "#F0FDF4", borderBottom: "1px solid #BBF7D0", padding: "10px 16px", fontSize: 12, color: "#14532D", fontWeight: 600 }}>
                  👥 Planejamento de Folha — {MONTH} (Competência {comp.mesComp})
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC", borderBottom: "2px solid #E2E8F0" }}>
                      {["Etapa", "Data", "Vencimento Legal", "Status"].map(h => (
                        <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, color: "#374151", fontSize: 12 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dpTasks.map((t, i) => {
                      // mes_ant = mês anterior ao comp
                      const mesAnt = comp.mes === 1 ? 12 : comp.mes - 1;
                      const anoAnt = comp.mes === 1 ? comp.ano - 1 : comp.ano;
                      const dataLabel = t.mes_ant ? fmtData(t.dia, mesAnt, anoAnt) : fmtData(t.dia, comp.mes, comp.ano);
                      return (
                      <tr key={t.key} style={{ borderBottom: "1px solid #F1F5F9", background: i % 2 === 0 ? "white" : "#FAFAFA" }}>
                        <td style={{ padding: "12px 16px", fontWeight: 600 }}>
                          <span style={{ background: "#DCFCE7", color: "#14532D", borderRadius: 6, padding: "2px 8px", fontWeight: 800, fontSize: 12, marginRight: 8 }}>
                            {t.mes_ant ? `${t.dia}/${String(mesAnt).padStart(2,"0")}` : `${String(t.dia).padStart(2,"0")}/${String(comp.mes).padStart(2,"0")}`}
                          </span>
                          {t.label}
                        </td>
                        <td style={{ padding: "12px 16px", color: "#64748B" }}>{dataLabel}</td>
                        <td style={{ padding: "12px 16px", color: "#64748B", fontSize: 12 }}>
                          {t.key === "fgts" ? "Dia 20 (GRF — nova regra)" : t.key === "inss_gps" ? "Dia 20 (GPS)" : t.key === "irrf_darf" ? "Dia 20 (DARF 0561)" : t.key === "esocial_reinf" ? "Dia 15" : "—"}
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <StatusBadge status={getStatus(`dp_${t.key}`)} onChange={v => setStatus(`dp_${t.key}`, v)} />
                        </td>
                      </tr>
                      );
                    })}
                  </tbody>
                </table>
                {/* Nota FGTS */}
                <div style={{ background: "#FEF3C7", borderTop: "1px solid #FDE68A", padding: "10px 16px", fontSize: 11, color: "#92400E" }}>
                  ⚠️ <strong>Atenção:</strong> O FGTS passou a ter vencimento no <strong>dia 20</strong> (mesmo prazo do INSS/GPS e IRRF), conforme nova legislação.
                </div>
              </div>
            )}
          </div>
        )}

        {/* MÓDULO 4 */}
        {activeTab === "modulo4" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Módulo 4 — Painel Visual Unificado — {MONTH}</h2>
              <div style={{ display: "flex", gap: 8 }}>
                {["Todos", "Lucro Presumido", "Simples Nacional"].map(r => (
                  <button key={r} onClick={() => setFilterRegime(r)} style={{
                    padding: "5px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                    border: `2px solid ${filterRegime === r ? "#2563EB" : "#E2E8F0"}`,
                    background: filterRegime === r ? "#EFF6FF" : "white",
                    color: filterRegime === r ? "#1D4ED8" : "#64748B", cursor: "pointer"
                  }}>{r}</button>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
              {Object.entries(catColors).map(([k, v]) => (
                <div key={k} style={{ display: "flex", alignItems: "center", gap: 6, background: v.bg, padding: "4px 12px", borderRadius: 20 }}>
                  <span>{v.icon}</span><span style={{ fontSize: 11, fontWeight: 700, color: v.text }}>{v.label}</span>
                </div>
              ))}
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#FEE2E2", padding: "4px 12px", borderRadius: 20 }}>
                <span>🔴</span><span style={{ fontSize: 11, fontWeight: 700, color: "#991B1B" }}>Prazo Crítico</span>
              </div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, minWidth: 900 }}>
                <thead>
                  <tr style={{ background: "#1E3A5F", color: "white" }}>
                    <th style={{ padding: "10px 12px", textAlign: "left", minWidth: 200, position: "sticky", left: 0, background: "#1E3A5F", fontWeight: 700 }}>Empresa</th>
                    <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 700 }}>Regime</th>
                    {[
                      `01–07/${String(comp.mes).padStart(2,"0")}`,
                      `08–14/${String(comp.mes).padStart(2,"0")}`,
                      `15–21/${String(comp.mes).padStart(2,"0")}`,
                      `22–${lastDay(comp.mes,comp.ano)}/${String(comp.mes).padStart(2,"0")}`,
                    ].map((w, wi) => (
                      <th key={wi} style={{ padding: "10px 12px", textAlign: "center", fontWeight: 700 }}>Semana {wi+1}<br /><span style={{ fontWeight: 400, opacity: 0.8 }}>{w}</span></th>
                    ))}
                    <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 700 }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmpresas.map((e, idx) => {
                    const ob = obrigacoesConfig.filter(o => o.checkFn(e));
                    const s1 = [], s2 = [], s3 = [], s4 = [];
                    s2.push({ label: "Docs cliente", tipo: "contabil" });
                    if (e.reinf) s3.push({ label: "EFD-REINF", tipo: "acessoria" });
                    s3.push({ label: "DCTF-Web", tipo: "acessoria" });
                    if (e.efd_fiscal) s3.push({ label: "EFD-Fiscal", tipo: "acessoria" });
                    if (e.dasn) s3.push({ label: "PGDAS-D", tipo: "acessoria" });
                    if (e.folha) { s3.push({ label: "FGTS+INSS+IRRF", tipo: "dp" }); }
                    s4.push({ label: "Balancete", tipo: "contabil" });
                    if (e.ecf) s4.push({ label: "ECF ⚡", tipo: "acessoria", critico: true });
                    if (e.mit) s4.push({ label: "MIT", tipo: "acessoria" });
                    const total = ob.length + (e.folha ? 3 : 0) + 2;
                    const renderCell = (items) => (
                      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        {items.length === 0 ? <span style={{ color: "#CBD5E1", fontSize: 10 }}>—</span> :
                          items.map((item, i) => {
                            const c = item.critico ? { bg: "#FEE2E2", text: "#991B1B" } : catColors[item.tipo];
                            return <span key={i} style={{ background: c.bg, color: c.text, padding: "2px 6px", borderRadius: 5, fontSize: 10, fontWeight: 700, textAlign: "center" }}>{item.label}</span>;
                          })}
                      </div>
                    );
                    return (
                      <tr key={e.id} style={{ borderBottom: "1px solid #F1F5F9", background: idx % 2 === 0 ? "white" : "#F8FAFC" }}>
                        <td style={{ padding: "10px 12px", position: "sticky", left: 0, background: idx % 2 === 0 ? "white" : "#F8FAFC", borderRight: "1px solid #E2E8F0" }}>
                          <div style={{ fontWeight: 700, fontSize: 11 }}>{e.razao}</div>
                          <div style={{ color: "#94A3B8", fontSize: 10 }}>{e.cnpj}</div>
                        </td>
                        <td style={{ padding: "10px 12px", textAlign: "center" }}><Badge regime={e.regime} /></td>
                        <td style={{ padding: "10px 12px", textAlign: "center" }}>{renderCell(s1)}</td>
                        <td style={{ padding: "10px 12px", textAlign: "center" }}>{renderCell(s2)}</td>
                        <td style={{ padding: "10px 12px", textAlign: "center" }}>{renderCell(s3)}</td>
                        <td style={{ padding: "10px 12px", textAlign: "center" }}>{renderCell(s4)}</td>
                        <td style={{ padding: "10px 12px", textAlign: "center" }}>
                          <span style={{ background: "#EFF6FF", color: "#1D4ED8", fontWeight: 800, fontSize: 13, borderRadius: 8, padding: "4px 10px" }}>{total}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MÓDULO IMPOSTOS */}
        {activeTab === "impostos" && <ModuloImpostos pagamentos={pagamentos} setPagamentos={setPagamentos} valores={valores} setValores={setValores} comp={comp} />}

        {/* CERTIFICADOS DIGITAIS */}
        {activeTab === "certdigital" && <ModuloCertificados />}

        {/* RESUMO EXECUTIVO */}
        {activeTab === "resumo" && (
          <ResumoExecutivo statuses={statuses} onNavigate={handleNavigate} comp={comp} />
        )}
      </div>
    </div>
  );
}
