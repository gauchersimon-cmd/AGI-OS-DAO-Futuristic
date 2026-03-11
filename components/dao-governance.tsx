"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Vote, ThumbsUp, ThumbsDown, Minus, Clock, TrendingUp, Users, Coins } from "lucide-react"
import { db, type Proposal } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

export function DaoGovernance() {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userVotingPower] = useState(12450)
  const [userVotes, setUserVotes] = useState<Record<string, "for" | "against" | "abstain">>({})
  const [selectedCategory, setSelectedCategory] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    loadProposals()
  }, [])

  const loadProposals = async () => {
    try {
      const data = await db.getProposals()
      setProposals(data)
    } catch (error) {
      console.error("[v0] Error loading proposals:", error)
      setProposals([
        {
          id: "1",
          title: "Upgrade Neural Network to v3.2",
          description: "Implement the latest neural network architecture with improved performance and efficiency",
          category: "technical",
          status: "active",
          votes_for: 842000,
          votes_against: 156000,
          votes_abstain: 45000,
          quorum_required: 500000,
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          ends_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "2",
          title: "Add New AI Agent Type: Multimodal",
          description: "Introduce a new agent type capable of processing text, images, and audio simultaneously",
          category: "technical",
          status: "active",
          votes_for: 654000,
          votes_against: 234000,
          votes_abstain: 78000,
          quorum_required: 500000,
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          ends_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "3",
          title: "Increase Token Rewards by 15%",
          description: "Boost community participation by increasing AGI token rewards for active contributors",
          category: "economic",
          status: "passed",
          votes_for: 1024000,
          votes_against: 89000,
          votes_abstain: 34000,
          quorum_required: 500000,
          created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          ends_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "4",
          title: "Implement Quadratic Voting",
          description: "Switch to quadratic voting mechanism for more democratic decision-making",
          category: "governance",
          status: "active",
          votes_for: 456000,
          votes_against: 567000,
          votes_abstain: 123000,
          quorum_required: 500000,
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          ends_at: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleVote = async (proposalId: string, vote: "for" | "against" | "abstain") => {
    if (userVotes[proposalId]) {
      toast({
        title: "Already Voted",
        description: "You have already voted on this proposal",
        variant: "destructive",
      })
      return
    }

    try {
      await db.voteOnProposal(proposalId, vote, userVotingPower)
      setUserVotes({ ...userVotes, [proposalId]: vote })
      await loadProposals()

      toast({
        title: "Success",
        description: `Vote cast: ${vote.toUpperCase()}`,
      })
    } catch (error) {
      console.error("[v0] Error voting:", error)
      setUserVotes({ ...userVotes, [proposalId]: vote })
      toast({
        title: "Vote Recorded",
        description: `Your ${vote} vote has been recorded locally`,
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30"
      case "passed":
        return "bg-green-500/10 text-green-400 border-green-500/30"
      case "rejected":
        return "bg-red-500/10 text-red-400 border-red-500/30"
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/30"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "technical":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
      case "economic":
        return "bg-purple-500/10 text-purple-400 border-purple-500/30"
      case "governance":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30"
      case "community":
        return "bg-pink-500/10 text-pink-400 border-pink-500/30"
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/30"
    }
  }

  const getTimeLeft = (endsAt?: string) => {
    if (!endsAt) return "No deadline"
    const now = new Date()
    const end = new Date(endsAt)
    const diff = end.getTime() - now.getTime()

    if (diff < 0) return "Ended"

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    return `${days}d ${hours}h`
  }

  const filteredProposals = proposals.filter((p) => selectedCategory === "all" || p.category === selectedCategory)

  const activeProposals = proposals.filter((p) => p.status === "active").length
  const totalVotes = proposals.reduce((sum, p) => sum + p.votes_for + p.votes_against + p.votes_abstain, 0)
  const participationRate = proposals.length > 0 ? Math.round((totalVotes / (proposals.length * 1000000)) * 100) : 0

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Loading proposals...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-slate-100 flex items-center text-xl">
                <Vote className="mr-2 h-6 w-6 text-purple-500" />
                DAO Governance
              </CardTitle>
              <CardDescription className="text-slate-400 mt-1">
                Participate in decentralized decision-making
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Active Proposals</div>
                <div className="text-2xl font-bold text-blue-400">{activeProposals}</div>
              </div>
              <Vote className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Your Voting Power</div>
                <div className="text-2xl font-bold text-purple-400">{userVotingPower.toLocaleString()}</div>
              </div>
              <Coins className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Participation Rate</div>
                <div className="text-2xl font-bold text-cyan-400">{participationRate}%</div>
              </div>
              <Users className="h-8 w-8 text-cyan-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Total Proposals</div>
                <div className="text-2xl font-bold text-green-400">{proposals.length}</div>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="bg-slate-800/50">
              <TabsTrigger value="all" className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400">
                All
              </TabsTrigger>
              <TabsTrigger
                value="technical"
                className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
              >
                Technical
              </TabsTrigger>
              <TabsTrigger
                value="economic"
                className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
              >
                Economic
              </TabsTrigger>
              <TabsTrigger
                value="governance"
                className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
              >
                Governance
              </TabsTrigger>
              <TabsTrigger
                value="community"
                className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
              >
                Community
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Proposals */}
      <div className="space-y-4">
        {filteredProposals.map((proposal) => {
          const totalVotes = proposal.votes_for + proposal.votes_against + proposal.votes_abstain
          const forPercentage = totalVotes > 0 ? (proposal.votes_for / totalVotes) * 100 : 0
          const againstPercentage = totalVotes > 0 ? (proposal.votes_against / totalVotes) * 100 : 0
          const abstainPercentage = totalVotes > 0 ? (proposal.votes_abstain / totalVotes) * 100 : 0
          const quorumPercentage = totalVotes > 0 ? (totalVotes / proposal.quorum_required) * 100 : 0
          const hasVoted = !!userVotes[proposal.id]

          return (
            <Card key={proposal.id} className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline" className={`${getStatusColor(proposal.status)} text-xs`}>
                        {proposal.status}
                      </Badge>
                      <Badge variant="outline" className={`${getCategoryColor(proposal.category)} text-xs`}>
                        {proposal.category}
                      </Badge>
                      <div className="flex items-center text-xs text-slate-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {getTimeLeft(proposal.ends_at)}
                      </div>
                    </div>
                    <CardTitle className="text-slate-100 text-lg">{proposal.title}</CardTitle>
                    <CardDescription className="text-slate-400 mt-2">{proposal.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Vote counts */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-400">For</span>
                      <ThumbsUp className="h-3 w-3 text-green-500" />
                    </div>
                    <div className="text-lg font-bold text-green-400">{proposal.votes_for.toLocaleString()}</div>
                    <div className="text-xs text-slate-500">{forPercentage.toFixed(1)}%</div>
                  </div>
                  <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-400">Against</span>
                      <ThumbsDown className="h-3 w-3 text-red-500" />
                    </div>
                    <div className="text-lg font-bold text-red-400">{proposal.votes_against.toLocaleString()}</div>
                    <div className="text-xs text-slate-500">{againstPercentage.toFixed(1)}%</div>
                  </div>
                  <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-400">Abstain</span>
                      <Minus className="h-3 w-3 text-slate-500" />
                    </div>
                    <div className="text-lg font-bold text-slate-400">{proposal.votes_abstain.toLocaleString()}</div>
                    <div className="text-xs text-slate-500">{abstainPercentage.toFixed(1)}%</div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Vote Distribution</span>
                    <span className="text-slate-400">{totalVotes.toLocaleString()} votes</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden flex">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-400"
                      style={{ width: `${forPercentage}%` }}
                    />
                    <div
                      className="bg-gradient-to-r from-red-500 to-red-400"
                      style={{ width: `${againstPercentage}%` }}
                    />
                    <div
                      className="bg-gradient-to-r from-slate-500 to-slate-400"
                      style={{ width: `${abstainPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Quorum */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Quorum Progress</span>
                    <span className={quorumPercentage >= 100 ? "text-green-400" : "text-slate-400"}>
                      {quorumPercentage.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={Math.min(quorumPercentage, 100)} className="h-2 bg-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                      style={{ width: `${Math.min(quorumPercentage, 100)}%` }}
                    />
                  </Progress>
                </div>

                {/* Voting buttons */}
                {proposal.status === "active" && (
                  <div className="flex items-center space-x-2 pt-2 border-t border-slate-700/50">
                    <Button
                      size="sm"
                      onClick={() => handleVote(proposal.id, "for")}
                      disabled={hasVoted}
                      className={`flex-1 ${
                        userVotes[proposal.id] === "for"
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-slate-700 hover:bg-slate-600"
                      }`}
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      Vote For
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleVote(proposal.id, "against")}
                      disabled={hasVoted}
                      className={`flex-1 ${
                        userVotes[proposal.id] === "against"
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-slate-700 hover:bg-slate-600"
                      }`}
                    >
                      <ThumbsDown className="h-4 w-4 mr-1" />
                      Vote Against
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleVote(proposal.id, "abstain")}
                      disabled={hasVoted}
                      className={`flex-1 ${
                        userVotes[proposal.id] === "abstain"
                          ? "bg-slate-600 hover:bg-slate-700"
                          : "bg-slate-700 hover:bg-slate-600"
                      }`}
                    >
                      <Minus className="h-4 w-4 mr-1" />
                      Abstain
                    </Button>
                  </div>
                )}
                {hasVoted && (
                  <div className="text-center text-sm text-cyan-400 pt-2 border-t border-slate-700/50">
                    You voted: {userVotes[proposal.id].toUpperCase()}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredProposals.length === 0 && (
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <Vote className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No proposals found in this category</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
