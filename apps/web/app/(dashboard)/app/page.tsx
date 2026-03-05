export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-primary mb-4">Dashboard</h1>
      <p className="text-muted-foreground">Bem-vinda ao seu painel de controle.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-2">Vendas do Mês</h3>
          <p className="text-3xl font-bold text-secondary">R$ 4.500,00</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-2">Clientes Ativos</h3>
          <p className="text-3xl font-bold text-accent">124</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-2">Produtos em Estoque</h3>
          <p className="text-3xl font-bold text-primary">89</p>
        </div>
      </div>
    </div>
  );
}
