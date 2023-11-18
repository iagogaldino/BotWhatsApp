import { promises as fsPromises } from 'fs';
/**
 * 
 * @param caminho 'caminho/do/arquivo.txt'
 * @param conteudo 'Conteúdo do arquivo.'
 */
export async function createFile(caminho: string, conteudo: string): Promise<void> {
  try {
    await fsPromises.writeFile(caminho, conteudo);
    console.log('Arquivo criado com sucesso!');
  } catch (err) {
    console.error('Erro ao criar o arquivo:', err);
  }
}
