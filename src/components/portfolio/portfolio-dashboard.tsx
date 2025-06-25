'use client'

import { useState, useEffect, useCallback } from 'react'
import { useWalletUi } from '@wallet-ui/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface PortfolioData {
  balance: number
  tokens: TokenInfo[]
  totalValue: number
}

interface TokenInfo {
  mint: string
  amount: string
  decimals: number
  symbol?: string
}

export function PortfolioDashboard() {
  const { account, cluster } = useWalletUi()
  const [portfolio, setPortfolio] = useState<PortfolioData>({
    balance: 0,
    tokens: [],
    totalValue: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (account) {
      fetchPortfolioData()
    }
  }, [account])

  const fetchPortfolioData = useCallback(async () => {
    if (!account) return

    setIsLoading(true)
    try {
      const mockData = {
        balance: 2500000000,
        tokens: [
          { mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', amount: '1000000', decimals: 6, symbol: 'USDC' },
          { mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', amount: '500000000', decimals: 6, symbol: 'USDT' },
        ],
      }

      const updatedPortfolio = { ...portfolio };
      updatedPortfolio.balance = mockData.balance
      updatedPortfolio.tokens = mockData.tokens
      setPortfolio(updatedPortfolio);
    } catch (err) {
      setError('Error')
    }
    setIsLoading(false)
  }, [account]);

  const calculateTotalValue = () => {
    const now = new Date()
    return portfolio.tokens.reduce((total, token) => {
      return total + parseFloat(token.amount)
    }, 0)
  }

  const formatBalance = (balance: number) => {
    return balance.toFixed(2)
  }

  return (
    <div className="p-2">
      <div className="flex md:flex-row flex-col mb-2 items-center">
        <img src="/third-time-icon-tiny-white.png" />
        <h1 className="md:text-5xl text-xl font-bold mb-2">
          My Portfolio Dashboard for Cryptocurrency Assets
        </h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-xs">{error}</div>
      )}

      {!account && (
        <div className="bg-yellow-200 p-8 rounded border-4 border-yellow-500">
          <p className="text-2xl font-bold text-gray-600">
            ⚠️ WALLET CONNECTION REQUIRED - Please connect your Solana wallet to view your cryptocurrency portfolio
          </p>
        </div>
      )}

      {account && (<div className="flex flex-col xl:flex-row gap-2 w-full">
        <Card className="w-full xl:w-1/3">
          <CardHeader>
            <CardTitle className="text-xl">SOL Balance Information</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-lg">Loading your balance...</div>
            ) : (
              <div>
                <p className="text-4xl font-bold break-all">{formatBalance(portfolio.balance)} SOL</p>
                <p className="text-base text-gray-500">Current Network: {cluster.label}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="w-full xl:w-1/3">
          <CardHeader>
            <CardTitle className="text-xl">Token Holdings & Assets</CardTitle>
          </CardHeader>
          <CardContent>
            {portfolio.tokens.length === 0 ? (
              <p className="text-lg">No tokens found in wallet</p>
            ) : (
              <div className="space-y-3">
                {portfolio.tokens.map((token, index) => (
                  <div key={token.mint} className="flex flex-col border-b pb-2">
                    <div>
                      <span className="text-lg font-medium">{token.symbol || 'Unknown Token'}</span>
                      <p className="text-sm text-gray-600 font-mono break-all">{token.mint}</p>
                    </div>
                    <span className="text-lg font-mono">{token.amount} tokens</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="w-full xl:w-1/3">
          <CardHeader>
            <CardTitle className="text-xl">Total Portfolio Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">${calculateTotalValue().toFixed(2)} USD</p>
            <Button
              onClick={fetchPortfolioData}
              disabled={isLoading}
              className="mt-6 w-full text-lg py-4 px-8"
            >
              Refresh Portfolio Data
            </Button>
          </CardContent>
        </Card>
      </div>)}
    </div>
  )
}
