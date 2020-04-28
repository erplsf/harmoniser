data Asset = Asset { currentValue :: Float
                   , targetAllocation :: Int
                   , unitPrice :: Float
                   } deriving Show

type Portfolio = [Asset]

-- Calculate ratio of each element in regards to the sum of the elements

main :: IO ()
main = do
  putStrLn "hello world"

-- ratios :: (Real a) => [a] -> [Rational]
ratios list = let size = toRational . sum $ list
               in map (/ size) list

-- deviation :: (Real a) => a -> a -> Rational
deviation target portion = toRational (target / portion) - 1
