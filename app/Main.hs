{-# LANGUAGE ParallelListComp #-}

module Lib where

-- calculate :: Target, [Assets] -> [Contribution]
-- fractions :: [Asset] -> [Deviation]

type Asset = Rational
type Fraction = Rational
type Contribution = Rational

-- | Calculate the fractional part of each Asset in respect to the total Portfolio (list of Assets)
fractions :: [Asset] -> Contribution -> [Fraction]
fractions assets contribution = [ asset / totalValue |
   let totalValue = toRational (sum assets) + contribution,
   asset <- assets]

type Target = Rational
type Deviation = Rational


-- [Target] must be summable to one!
-- fractional deviations
deviations :: [Target] -> [Fraction] -> [Deviation]
deviations targets fractions = [ portion / target - 1 |
                                 portion <- fractions |
                                 target <- targets]

-- bad name
-- take the lowest deviation (asset), add the money to it until it matches to the next deviation, repeat until there's no money left
calculate :: [Deviation] -> Contribution -> [Contribution]
calculate deviations 0 = [0 | _ <- deviations]
-- add other cases
