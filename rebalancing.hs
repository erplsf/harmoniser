-- Calculate ratio of each element in regards to the sum of the elements
ratios :: (Real a) => [a] -> [Rational]
--ratios x = [ (toRational el) / toRational (sum x) | el <- x ]
ratios list = [ toRational el / toRational s  | el <- list, let s = sum list ]

--deviation x = [ portion % target - 1 | portion <- fst x, target <- snd x ]
