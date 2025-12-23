"use client";

import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Star } from "lucide-react";

interface Review {
  id: number;
  name: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

interface ProductTabsProps {
  description?: string;
  ingredients?: string[];
  howToUse?: string;
  reviews?: Review[];
  rating?: number;
  reviewCount?: number;
}

const defaultReviews: Review[] = [
  {
    id: 1,
    name: "Sarah M.",
    rating: 5,
    date: "2 weeks ago",
    comment:
      "This product has completely transformed my hair! I've noticed significantly less hair fall and my hair feels much stronger. The scent is amazing and it doesn't leave any greasy residue. Worth every penny!",
    verified: true,
  },
  {
    id: 2,
    name: "Jennifer L.",
    rating: 5,
    date: "1 month ago",
    comment:
      "I've been using this for about 6 weeks now and I can already see new baby hairs growing along my hairline. My scalp feels healthier and my hair has more volume. Love that it's made with natural ingredients!",
    verified: true,
  },
  {
    id: 3,
    name: "Michelle T.",
    rating: 4,
    date: "1 month ago",
    comment:
      "Great product! The only reason I'm giving 4 stars instead of 5 is that I wish it came in a larger size. The quality is exceptional and I love supporting a Canadian brand.",
    verified: true,
  },
];

const defaultDescription = `Our signature product is a potent blend of pure essential oils and nourishing botanicals, specially formulated to promote hair growth, strengthen hair follicles, and improve overall scalp health. This luxurious treatment has become a cult favorite among those seeking natural solutions for hair care.

**Key Benefits:**
- Stimulates Hair Growth: Clinically proven to improve circulation to the scalp, encouraging new hair growth and reducing hair loss.
- Strengthens Hair: Rich in antioxidants that protect and fortify each strand from root to tip.
- Improves Scalp Health: Natural antimicrobial properties help maintain a healthy scalp environment.
- Adds Shine & Softness: Nourishing oils deeply condition without weighing hair down.
- Reduces Dandruff: Helps balance scalp oils and soothe irritation.

**Why Choose Luxivie?**
Unlike many products on the market, our formula contains only the highest quality, cold-pressed ingredients. We never use synthetic fragrances, parabens, sulfates, or any harsh chemicals. Every bottle is carefully crafted in Canada with sustainably sourced botanicals, ensuring you get the purest, most effective product possible.`;

const defaultIngredients = [
  {
    name: "Rosmarinus Officinalis (Rosemary) Leaf Oil",
    description: "Pure, therapeutic-grade rosemary essential oil known for its hair growth-promoting properties. Stimulates blood circulation to the scalp and strengthens hair follicles.",
  },
  {
    name: "Simmondsia Chinensis (Jojoba) Seed Oil",
    description: "Closely mimics the skin's natural sebum, making it easily absorbed. Moisturizes without leaving a greasy residue and helps regulate scalp oil production.",
  },
  {
    name: "Prunus Amygdalus Dulcis (Sweet Almond) Oil",
    description: "Rich in vitamins E and B, plus essential fatty acids that nourish and strengthen hair while adding natural shine.",
  },
  {
    name: "Argania Spinosa (Argan) Kernel Oil",
    description: "Packed with antioxidants and vitamin E to protect hair from environmental damage and improve elasticity.",
  },
  {
    name: "Tocopherol (Vitamin E)",
    description: "Natural preservative and powerful antioxidant that helps repair damaged hair and protects against free radicals.",
  },
];

const defaultHowToUse = `**Application Instructions:**

1. **Start with dry or damp hair**
   For best results, apply to clean hair after washing. Hair can be completely dry or slightly damp.

2. **Apply 3-5 drops to scalp**
   Using the dropper, apply oil directly to areas of concern or evenly across the scalp. Use more for thicker or longer hair.

3. **Massage gently**
   Use fingertips to massage the oil into your scalp using circular motions for 2-3 minutes to boost circulation.

4. **Leave in or overnight**
   For quick treatment, leave in for at least 30 minutes. For intensive care, leave overnight and wash out in the morning.

5. **Style as usual**
   If leaving in during the day, you can style your hair normally. The oil absorbs quickly and won't leave residue.

**Pro Tips:**
- Use 2-3 times per week for best results. Consistent use shows visible improvement in 4-6 weeks.
- Can also be applied to hair ends to prevent split ends and add shine.
- Store in a cool, dark place to maintain oil potency. The dark glass bottle helps preserve freshness.`;

export function ProductTabs({
  description = defaultDescription,
  ingredients,
  howToUse = defaultHowToUse,
  reviews = defaultReviews,
  rating = 4.8,
  reviewCount = 0,
}: ProductTabsProps) {
  const displayReviewCount = reviewCount > 0 ? reviewCount : reviews.length;
  const displayRating = rating || 4.8;

  // Parse ingredients if it's an array of strings
  const parsedIngredients = Array.isArray(ingredients)
    ? ingredients.map((ing, idx) => ({
        name: typeof ing === 'string' ? ing : ing.name || `Ingredient ${idx + 1}`,
        description: typeof ing === 'object' && ing.description ? ing.description : '',
      }))
    : defaultIngredients;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mt-16"
    >
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="w-full justify-start bg-white border-b border-gray-200 rounded-none h-auto p-0 overflow-x-auto scrollbar-hide">
          <TabsTrigger
            value="description"
            className="px-3 sm:px-4 md:px-6 py-3 md:py-4 rounded-none border-b-2 border-transparent data-[state=active]:border-[#BFC8B3] data-[state=active]:bg-transparent text-sm md:text-base whitespace-nowrap"
          >
            Description
          </TabsTrigger>
          <TabsTrigger
            value="ingredients"
            className="px-3 sm:px-4 md:px-6 py-3 md:py-4 rounded-none border-b-2 border-transparent data-[state=active]:border-[#BFC8B3] data-[state=active]:bg-transparent text-sm md:text-base whitespace-nowrap"
          >
            Ingredients
          </TabsTrigger>
          <TabsTrigger
            value="howto"
            className="px-3 sm:px-4 md:px-6 py-3 md:py-4 rounded-none border-b-2 border-transparent data-[state=active]:border-[#BFC8B3] data-[state=active]:bg-transparent text-sm md:text-base whitespace-nowrap"
          >
            How to Use
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="px-3 sm:px-4 md:px-6 py-3 md:py-4 rounded-none border-b-2 border-transparent data-[state=active]:border-[#BFC8B3] data-[state=active]:bg-transparent text-sm md:text-base whitespace-nowrap"
          >
            Reviews ({displayReviewCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="pt-6 md:pt-8 space-y-4 md:space-y-6">
          <div className="prose prose-gray max-w-none">
            <div className="text-sm md:text-base text-gray-600 whitespace-pre-line">
              {description.split('\n').map((line, idx) => {
                if (line.startsWith('**') && line.endsWith('**')) {
                  return <h3 key={idx} className="text-base md:text-lg text-gray-900 mt-4 md:mt-6 mb-2 font-semibold">{line.replace(/\*\*/g, '')}</h3>;
                }
                if (line.startsWith('- ')) {
                  return <li key={idx} className="text-gray-600 mb-2">{line.substring(2)}</li>;
                }
                return <p key={idx} className="text-gray-600 mb-3 md:mb-4">{line}</p>;
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ingredients" className="pt-6 md:pt-8">
          <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 border border-gray-200 space-y-3 md:space-y-4">
            <h3 className="text-base md:text-lg text-gray-900 font-semibold">Full Ingredient List</h3>
            <div className="space-y-3 md:space-y-4">
              {parsedIngredients.map((ingredient, index) => (
                <div key={index}>
                  <h4 className="text-sm md:text-base text-gray-900 mb-1 md:mb-2 font-medium">{ingredient.name}</h4>
                  {ingredient.description && (
                    <p className="text-xs md:text-sm text-gray-600">{ingredient.description}</p>
                  )}
                </div>
              ))}
            </div>
            <div className="pt-3 md:pt-4 border-t border-gray-200">
              <p className="text-xs md:text-sm text-gray-600">
                <strong>Free from:</strong> Parabens, Sulfates, Phthalates,
                Synthetic Fragrances, Mineral Oil, Silicones, Formaldehyde
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="howto" className="pt-6 md:pt-8">
          <div className="space-y-4 md:space-y-6">
            <div className="bg-[#BFC8B3]/10 rounded-lg md:rounded-xl p-4 md:p-6 border border-[#BFC8B3]/20">
              <div className="text-sm md:text-base text-gray-600 whitespace-pre-line">
                {howToUse.split('\n').map((line, idx) => {
                  if (line.match(/^\d+\./)) {
                    const parts = line.split(/\*\*/);
                    return (
                      <div key={idx} className="flex gap-3 md:gap-4 mb-3 md:mb-4">
                        <span className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 bg-[#BFC8B3] text-white rounded-full flex items-center justify-center text-sm md:text-base font-medium">
                          {line.match(/^\d+/)?.[0]}
                        </span>
                        <div className="flex-1">
                          {parts.map((part, pidx) => {
                            if (part.includes('**')) {
                              return <strong key={pidx} className="text-gray-900 block mb-1 text-sm md:text-base">{part.replace(/\*\*/g, '')}</strong>;
                            }
                            return <span key={pidx} className="text-sm md:text-base">{part}</span>;
                          })}
                        </div>
                      </div>
                    );
                  }
                  if (line.startsWith('**')) {
                    return <h3 key={idx} className="text-base md:text-lg text-gray-900 mb-3 md:mb-4 font-semibold">{line.replace(/\*\*/g, '')}</h3>;
                  }
                  if (line.startsWith('- ')) {
                    return (
                      <li key={idx} className="flex gap-2 md:gap-3 mb-2 md:mb-3 text-gray-600">
                        <span className="text-[#BFC8B3]">•</span>
                        <span className="text-sm md:text-base">{line.substring(2)}</span>
                      </li>
                    );
                  }
                  return <p key={idx} className="text-gray-600 mb-3 md:mb-4 text-sm md:text-base">{line}</p>;
                })}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="pt-6 md:pt-8 space-y-4 md:space-y-6">
          {/* Reviews Summary */}
          <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 border border-gray-200">
            <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
              <div>
                <div className="text-4xl md:text-5xl text-gray-900 mb-2">{displayRating.toFixed(1)}</div>
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 md:w-5 md:h-5 ${
                        i < Math.floor(displayRating)
                          ? "fill-[#BFC8B3] text-[#BFC8B3]"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm md:text-base text-gray-600">Based on {displayReviewCount} reviews</p>
              </div>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = reviews.filter(r => r.rating === stars).length;
                  const percentage = displayReviewCount > 0 ? (count / displayReviewCount) * 100 : 0;
                  return (
                    <div key={stars} className="flex items-center gap-2 md:gap-3">
                      <span className="text-xs md:text-sm text-gray-600 w-6 md:w-8">{stars}★</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#BFC8B3]"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs md:text-sm text-gray-600 w-8 md:w-10">
                        {percentage > 0 ? `${Math.round(percentage)}%` : '0%'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Individual Reviews */}
          <div className="space-y-3 md:space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 border border-gray-200"
              >
                <div className="flex items-start justify-between mb-2 md:mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm md:text-base text-gray-900 font-medium">{review.name}</span>
                      {review.verified && (
                        <span className="text-xs bg-[#BFC8B3]/20 text-gray-700 px-2 py-0.5 rounded">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 md:w-4 md:h-4 ${
                              i < review.rating
                                ? "fill-[#BFC8B3] text-[#BFC8B3]"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs md:text-sm text-gray-500">
                        {review.date}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm md:text-base text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

