async function buscarItemAleatorio() {
  try {
    // Fazer uma requisição para o backend do DSpace para obter a lista de itens
    const response = await fetch('http://192.168.1.20:8080/server/api/core/items/29a10226-af05-40a1-a681-0fcd74f33732');
    const items = await response.json();

    // Gerar um índice aleatório com base no tamanho da lista de itens
    const randomIndex = Math.floor(Math.random() * items.length);

    // Retornar o item aleatório
    return items[randomIndex];
  } catch (error) {
    console.error('Erro ao buscar item aleatório:', error);
    throw error;
  }
}
