# Somnia NFT dApp

A feature-rich NFT minting application built on the Somnia Network, allowing users to mint NFTs using both native tokens (STT) and ERC20 tokens (IKOIN), view their NFT collection, and interact with the Somnia blockchain.

## Live Demo

**Deployed Application:** [https://somnia-nft.vercel.app/](https://somnia-nft.vercel.app/)

## 📋 Table of Contents

- [Overview](#overview)
- [Setup & Installation](#setup--installation)
- [Features](#features)
- [Project Structure](#project-structure)
- [Key Components](#key-components)
- [Technical Implementation](#technical-implementation)
- [User Experience](#user-experience)
- [Architecture Decisions](#architecture-decisions)
- [Performance Optimizations](#performance-optimizations)
- [Future Improvements](#future-improvements)

## 🔍 Overview

This application is a full-featured NFT minting dApp built for the Somnia Network. It allows users to:

- Connect their cryptocurrency wallets (MetaMask)
- Switch between payment methods
- Mint NFTs using native STT tokens or IKOIN (ERC20)
- Mint additional IKOIN tokens through a helpful dialog when balance is insufficient
- View their owned NFT collection
- View detailed information about each NFT

The app demonstrates interaction with smart contracts, transaction management, and responsive UI design.

## 🚀 Setup & Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/williamslsy/somnia-nft
   cd somnia-nft
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create environment file**
   Create a `.env.local` file with the following:

   ```
   NEXT_PUBLIC_PROJECT_ID=your_wallet_connect_project_id
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

## ✨ Features

### Wallet Connection & Network

- Seamless wallet connection using RainbowKit
- Automatic detection and prompting for Somnia Testnet network
- Real-time wallet connection state management

### NFT Minting

- Dual payment options (STT native token and IKOIN ERC20)
- Transaction approval flow for ERC20 payments
- Minting limits enforcement (max 50 NFTs per wallet)
- Live pricing calculations
- Transaction status notifications
- Interactive dialog for minting more IKOIN tokens when balance is insufficient

### Gallery & NFT Viewing

- Complete collection viewing for owned NFTs
- NFT metadata display with image rendering
- Search functionality for owned NFTs
- Empty state handling for users without NFTs
- Loading states and skeletons during data fetching

### User Experience

- Responsive design for mobile, tablet, and desktop
- Comprehensive error handling and user feedback
- Toast notifications for transaction status
- Interactive UI components with clear user guidance
- Loading states and transitions

## 🏗️ Project Structure

```
somnia-nft/
├─ public/
│  └─ assets/                # Static assets and images
├─ src/
│  ├─ app/                   # Next.js application routes
│  │  ├─ gallery/            # Gallery page
│  │  ├─ mint/               # Minting page
│  │  └─ page.tsx            # Landing page
│  ├─ components/            # Reusable UI components
│  │  ├─ gallery/            # Gallery-specific components
│  │  │  ├─ collection-header.tsx
│  │  │  ├─ connect-wallet-prompt.tsx
│  │  │  ├─ empty-collection-view.tsx
│  │  │  ├─ expanded-collection.tsx
│  │  │  ├─ index.tsx
│  │  │  ├─ nft-card-skeleton.tsx
│  │  │  ├─ nft-card.tsx
│  │  │  ├─ nft-grid.tsx
│  │  │  ├─ no-search-results.tsx
│  │  │  └─ search-bar.tsx
│  │  ├─ mint/               # Minting-specific components
│  │  │  ├─ collection-info-footer.tsx
│  │  │  ├─ erc20-minter-dialog.tsx
│  │  │  ├─ index.tsx
│  │  │  ├─ mint-controls.tsx
│  │  │  ├─ mint-status-header.tsx
│  │  │  ├─ nft-showcase.tsx
│  │  │  ├─ payment-method-tabs.tsx
│  │  │  └─ terms-of-service.tsx
│  │  ├─ ui/                 # UI components (toast, etc.)
│  │  ├─ header.tsx          # Application header
│  │  └─ logo.tsx            # Logo component
│  ├─ constants/             # Global constants
│  │  └─ publicClient.ts     # Viem public client configuration
│  ├─ contexts/              # React contexts
│  │  ├─ NFTProvider.tsx     # NFT context provider
│  │  └─ WalletProvider.tsx  # Wallet context provider
│  ├─ hooks/                 # Custom React hooks
│  │  ├─ useMintAmount.ts    # Mint amount management
│  │  ├─ useMintControls.ts  # Minting controls
│  │  ├─ useMintLimits.ts    # Minting limits
│  │  ├─ useNFT.ts           # NFT data aggregation
│  │  ├─ useNFTLocalStorage.ts # NFT caching
│  │  ├─ useNFTMetadata.ts   # NFT metadata
│  │  └─ useNFTOwnership.ts  # NFT ownership data
│  ├─ lib/                   # Utility libraries
│  │  ├─ chains.ts           # Chain configuration
│  │  └─ config.ts           # Contract configurations
│  |
├─ .eslintrc.json
├─ next.config.js
├─ package.json
├─ tailwind.config.js
└─ tsconfig.json
```

## 🧩 Key Components

### NFT Context Provider

The NFT Context Provider (`NFTProvider.tsx`) is the core state management system that controls all NFT-related functionality.

### Mint Section

The Mint Section (`MintSection.tsx`) component handles the NFT minting interface.

### NFT Gallery

The NFT Gallery component displays all owned NFTs with search capability.

## 🔧 Technical Implementation

### Contract Integration

The application interacts with two smart contracts on the Somnia Testnet:

1. **NFT Contract (SomniaTest)**: Handles the minting and querying of NFTs

   - Address: `0xac0C516BDA6834556A0C7499280f20507eb6f59b`
   - Key Functions:
     - `mintNative`: Mint NFT with native STT tokens
     - `mintWithERC20`: Mint NFT with IKOIN tokens
     - `tokensOf`: Query NFTs owned by an address

2. **ERC20 Contract (IKOIN)**: Manages the ERC20 token used for payments
   - Address: `0x7e41af17346bD0cd23998A71509DFD20938f50A1`
   - Key Functions:
     - `approve`: Approve tokens for spending
     - `balanceOf`: Get token balance of an address

### Wallet Integration

The app uses RainbowKit and wagmi to handle wallet connections.

### NFT Metadata and Display

The application handles NFT metadata fetching and rendering:

- Metadata is fetched directly from the contract
- Images are displayed based on token ID
- Cache mechanisms improve performance for returning users

### Smart Contract Interaction

The application uses Wagmi/Viem for smart contract interactions.

## 👤 User Experience

The application prioritizes user experience in several ways:

### Transaction Flows

- **Two-Step Process for ERC20 Minting**:
  1. Approval transaction
  2. Minting transaction
- Real-time transaction feedback via toast notifications
- Clear feedback on transaction status (pending, confirming, success, error)

### Responsive Design

- Mobile-first approach
- Adaptive layouts for different screen sizes
- Touch-friendly controls for mobile users

### Error Handling

- Comprehensive error handling for contract interactions
- User-friendly error messages
- Fallback mechanisms for failed operations

### Performance Optimizations

- NFT caching in local storage
- Optimistic UI updates
- Debounced inputs
- Memoized components and callbacks

## 🧠 Architecture Decisions

### File Naming Conventions

- Kebab-case (kebab-case.tsx) is used for all component file names instead of PascalCase (PascalCase.tsx)
- This approach aligns with Next.js file-based routing conventions where pages and routes use kebab-case
- Maintaining consistent naming patterns throughout the application improves developer experience and code navigation
- While React components themselves use PascalCase in the code (e.g., function MintDialog()), their filenames follow the kebab-case pattern for consistency with the Next.js ecosystem

### State Management

- Context API for global state (NFT data, wallet connection)
- Local state for component-specific concerns
- Custom hooks for reusable logic

### Component Structure

- Container/Presentational pattern
- Feature-based organization (mint/, gallery/)
- Shared UI components in ui/ directory

### Styling Approach

- Tailwind CSS for utility-first styling
- Responsive design principles
- Consistent design system

### Performance Considerations

- Memoized calculations and callbacks
- Optimized re-renders
- Local storage caching for persistent data

## 📊 Performance Optimizations

- **Code Splitting**: Next.js automatic code splitting
- **Image Optimization**: Next.js Image component
- **Memoization**: useMemo and useCallback for expensive operations
- **Local Storage Caching**: Storing NFT data for faster loading
- **Smart Re-rendering**: Careful component structure to minimize re-renders

## 🔮 Future Improvements

- Integration with IPFS for decentralized metadata storage
- Advanced filtering and sorting options in the gallery
- NFT trading capabilities
- Social sharing features
- Enhanced analytics on NFT ownership
