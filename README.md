<div align="center">
	<img src="/public/lovaas-logo.png" alt="Lovaas" width="350px">

	<p>
		Sistema de gestão do cuidado a pessoas com Transtorno do Espectro Autista (TEA) na rede pública de saúde.
	</p>
</div>

## Sobre o Projeto

Este projeto foi desenvolvido para o Hackaton BNB, organizado pelo Fórum de Tecnologia e Inovação da Universidade Federal do Ceará, Campus de Crateús. O intuito da competição é desenvolver soluções tecnológicas inovadoras para os desafios enfrentados pela Prefeitura Municipal de Crateús.

A solução consiste num sistema informatizado que permite a gestão de cuidados a pessoas com TEA, otimizando o atendimento multidisciplinar e o gerenciamento de filas, utilizando um algoritmo que vai analisar a ficha do paciente e com base nos dados apresentados, definir o nível de prioridade que essa pessoa vai ter para receber o atendimento solicitado. Além disso, o sistema também serve para otimizar o trabalho dos profissionais de saúde especializados na área, visto que eles terão acesso a um sistema unificado que permite realizar o cadastro de novas pessoas, visualizar uma ficha completa com todas as informações e histórico de consultas além de organizar automaticamente um cronograma semanal, baseado no nível de prioridade do paciente.

## Ferramentas utilizadas

Devido ao tempo curto e limitação de conhecimento, optamos por criar um wireframe utilizando o [Figma](https://figma.com/) e posteriormente utilizar o [Lovable AI](https://lovable.dev) para transformar o wireframe em um site funcional.

## Como Instalar e Rodar o Projeto

Para rodar a plataforma, você precisará ter instalado no seu computador:

- [Node.js](https://nodejs.org/pt-br/download)
- [npm](https://docs.npmjs.com/cli/v11/configuring-npm/install)

Clone este repositório usando o comando:

```bash
git clone https://github.com/opestanadev/lovaas.git
cd lovaas
```

Agora, você precisará instalar as bibliotecas para poder executar o programa, só precisará rodar esse comando uma única vez:

`npm install`

Agora, para rodar o site localmente, execute:

`npm run dev`

Depois de executado o comando, é esperado que o sistema lhe retorne um link parecido com esse: **http://localhost:5173/**

Copie o link e cole no seu navegador de preferência e pronto, o site já estará rodando localmente na sua máquina!

## License

[MIT License](./LICENSE)
