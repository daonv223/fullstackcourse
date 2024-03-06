import { useState } from 'react'

const Button = ({onCick, text}) => (
  <button onClick={onCick}>
    {text}
  </button>
)

const AnecdoteDisplay = ({heading, content, vote}) =>  (
  <div>
    <h1>{heading}</h1>
    <p>{content}</p>
    <p>has {vote} votes</p>
  </div>
)

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
  
  const getRandomIndex = () => {
    return Math.floor(Math.random() * anecdotes.length)
  }

  const [selected, setSelected] = useState(getRandomIndex())

  const [votes, setVotes] = useState(new Uint8Array(anecdotes.length))

  const handleVote = () => {
    const copyOfVotes = [...votes]
    copyOfVotes[selected] += 1
    setVotes(copyOfVotes)
  }

  let maxIndex = 0
  let maxVote = votes[maxIndex];
  for (let i = 1; i < votes.length; i++) {
    if (votes[i] > maxVote) {
      maxVote = votes[i];
      maxIndex = i;
    }
  }

  return (
    <div>
      <AnecdoteDisplay heading="Anecdote of the day" content={anecdotes[selected]} vote={votes[selected]} />
      <Button onCick={handleVote} text="vote" />
      <Button onCick={() => setSelected(getRandomIndex())} text="next anecdotes" />
      <AnecdoteDisplay heading="Anecdote with most votes" content={anecdotes[maxIndex]} vote={maxVote} />
    </div>
  )
}

export default App