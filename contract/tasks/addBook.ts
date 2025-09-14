import { task } from 'hardhat/config';

task("addBook", "本の情報を追加するタスク")
  .addParam("title", "本のタイトル")
  .addParam("url", "本のURL")
  .setAction(async (taskArgs) => {
    const { title, url } = taskArgs;

    // 1. デプロイ済みコントラクトのアドレス
    // const contractAddress: `0x${string}` = "0x07BaD34F93032cfaD3432DdD1b1BdFC32DDddb7D";
    const contractAddress: `0x${string}` = process.env.BOOK_NFT_CONTRACT_ADDRESS;

    // 2. コントラクト名 (型: string)
    const contractName: string = "BookNFT";

    console.log(`Add book to ${contractName} at ${contractAddress} ...`);

    // 3. viemを使ってコントラクトのインスタンスを取得
    const bookContract = await viem.getContractAt(contractName, contractAddress);
    
    // 4. コントラクトの関数を呼び出す
    await bookContract.write.mint([title, url]);
    
    // 5. 結果を表示
    console.log(`✅ Book added: ${title} (${url})`);
});
