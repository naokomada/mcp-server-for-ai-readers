import { task } from 'hardhat/config';

task("getBookTitles", "本のタイトルを取得するタスク")
  .addParam("tokenid", "取得したいNFTのtokenid")
  .setAction(async (taskArgs) => {
    // 実行時に渡される引数をtokenIdとして使用します
    const tokenId = taskArgs.tokenid;

    // 1. デプロイ済みコントラクトのアドレス
    const contractAddress: `0x${string}` = process.env.BOOK_NFT_CONTRACT_ADDRESS;

    // 2. コントラクト名 (型: string)
    const contractName: string = "BookNFT";

    console.log(`Getting state from ${contractName} at ${contractAddress} ...`);

    // 3. viemを使ってコントラクトのインスタンスを取得
    const bookContract = await viem.getContractAt(contractName, contractAddress);

    // 4. コントラクトの読み取り専用関数を呼び出す
    //    .read プロパティ経由で呼び出します
    const resTitle: string = await bookContract.read.getBookTitle([tokenId]);
    const resUrl: string = await bookContract.read.getBookUrl([tokenId]);

    // 5. 結果を表示
    console.log(`✅ Current value is: ${resTitle.toString()}, ${resUrl.toString()}`);

    // 6. すべてのタイトルを表示
    const resAllTitles: string[] = await bookContract.read.getAllBookTitles();    

    console.log(`✅ All book titles:`);
    resAllTitles.forEach((title) => {
      console.log(` - ${title}`);
    });
});
