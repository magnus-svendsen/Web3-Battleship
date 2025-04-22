function NewUserInformation() {
  return (
    <div className="flex justify-center mb-10">
      <div className="max-w-5xl px-8 py-10 text-white">
        <h2 className="text-2xl font-bold mb-4 text-cyan-400">⛓️ What is Web3?</h2>
        <ul className="text-lg mb-8 ml-8 leading-relaxed list-disc text-white/90">
          <li><strong>Web3</strong> is a <em>new way of thinking</em> about the internet — focused on decentralization and user control.</li>
          <li>Unlike <strong>Web2</strong> (where large companies store your data), Web3 uses <strong>blockchain networks</strong> run by independent nodes.</li>
          <li>This gives you <strong>more transparency</strong>, <strong>privacy</strong>, and <strong>ownership</strong> of your identity and data.</li>
        </ul>

        <h2 className="text-2xl font-bold mb-4 text-cyan-400">🔐 Login using Vipps vs MetaMask</h2>
        <ul className="text-lg mb-8 ml-8 leading-relaxed list-disc text-white/90">
          <li><strong>MetaMask</strong> is a popular Web3 wallet where <strong>you manage your own private key</strong>.</li>
          <li><strong>If you lose your private key, you lose access — permanently.</strong></li>
          <li>To make things easier, we offer <strong>Vipps Login</strong> — a method many users already know and trust.</li>
          <li>It’s perfect for beginners: <strong>no wallet setup, no seed phrases, just play!</strong></li>
        </ul>

        <h2 className="text-2xl font-bold mb-4 text-cyan-400">🪙 What are Transactions?</h2>
        <ul className="text-lg mb-8 ml-8 leading-relaxed list-disc text-white/90">
          <li>In Web3, actions like <strong>placing ships</strong> or <strong>attacking</strong> are blockchain transactions.</li>
          <li>Each transaction requires a small fee called <strong>"gas"</strong>, used to process actions securely on the network.</li>
          <li>Some actions involve <strong>smart contracts</strong> — self-executing programs that guarantee fairness and transparency.</li>
        </ul>

        <h2 className="text-2xl font-bold mb-4 text-cyan-400">💸 Do I Need Real Money?</h2>
        <ul className="text-lg mb-8 ml-8 leading-relaxed list-disc text-white/90">
          <li><strong>No real money is needed!</strong></li>
          <li>The game runs on the <strong>Sepolia testnet</strong>, using <strong>fake ETH</strong> for learning and experimentation.</li>
          <li>This means you can explore and interact with blockchain features <strong>completely free</strong> — <em>no cost, no risk.</em></li>
        </ul>

        <h2 className="text-2xl font-bold mb-4 text-cyan-400">✨ Our Goal</h2>
        <ul className="text-lg ml-8 leading-relaxed list-disc text-white/90">
          <li>We want to make Web3 <strong>accessible and intuitive</strong> for everyone — especially newcomers.</li>
          <li>By using <strong>familiar login options like Vipps</strong>, we reduce the friction of trying blockchain-based apps.</li>
          <li>You get to experience the <strong>core benefits</strong> of Web3 without needing deep technical knowledge.</li>
        </ul>
      </div>
    </div>
  );
}

export default NewUserInformation;
