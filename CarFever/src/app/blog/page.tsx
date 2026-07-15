import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { BlogCard } from '@/components/blog-card';
import { BlogSearch } from '@/components/blog-search';
import { BlogCategories } from '@/components/blog-categories';
import { BlogNewsletter } from '@/components/blog-newsletter';
import { Button } from '@/components/ui/button';

export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
  title: 'Car Fever Blog - Latest Automotive News & Reviews',
  description: 'Stay up to date with the latest car news, expert reviews, maintenance tips, and exclusive insights from the Car Fever team.',
};

// Static fallback data for instant loading
const fallbackPosts = [
  {
    id: '1',
    slug: 'first-blog',
    title: 'Latest Car Trends 2026',
    excerpt: 'Discover the newest trends in the automotive industry for 2026.',
    featured_image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800',
    published_at: new Date().toISOString(),
    views_count: 1200,
    categories: { name: 'News', slug: 'news' },
    author: { name: 'John Doe', avatar_url: null }
  },
  {
    id: '2',
    slug: 'second-blog',
    title: 'Electric Vehicles: The Future',
    excerpt: 'Everything you need to know about electric vehicles and their impact.',
    featured_image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800',
    published_at: new Date(Date.now() - 86400000).toISOString(),
    views_count: 850,
    categories: { name: 'Electric', slug: 'electric' },
    author: { name: 'Jane Smith', avatar_url: null }
  }
];

const fallbackCategories = [
  { id: '1', name: 'News', slug: 'news', post_count: 12 },
  { id: '2', name: 'Electric', slug: 'electric', post_count: 8 },
  { id: '3', name: 'Reviews', slug: 'reviews', post_count: 15 }
];

async function getBlogData() {
  // Instant load - just use fallback data
  return { posts: fallbackPosts, categories: fallbackCategories };
}

export default async function BlogPage() {
  const { posts, categories } = await getBlogData();
  
  const featuredPosts = posts.slice(0, 1);
  const recentPosts = posts.slice(1);

  return (
    <div className="min-h-screen bg-[#F8F9FA] pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Hero Section */}
        <section className="text-center py-16 md:py-24 max-w-4xl mx-auto space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight">
            Car Fever <span className="text-[#0055FE]">Blog</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500">
            Latest news, reviews, and tips about the world's most exclusive luxury and performance cars.
          </p>
          <div className="flex justify-center pt-4">
            <BlogSearch />
          </div>
        </section>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 border-l-4 border-[#0055FE] pl-4">Featured Article</h2>
            {featuredPosts.map(post => (
              <BlogCard key={post.id} post={post as any} featured />
            ))}
          </section>
        )}

        {/* Categories */}
        {categories.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-[#0055FE] pl-4">Explore by Category</h2>
            </div>
            <BlogCategories categories={categories as any} />
          </section>
        )}

        {/* Recent Posts Grid */}
        <section className="mb-24">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 border-l-4 border-[#0055FE] pl-4">Recent Posts</h2>
          
          {recentPosts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {recentPosts.map(post => (
                  <BlogCard key={post.id} post={post as any} />
                ))}
              </div>
              
              <div className="flex justify-center">
                <Button variant="outline" className="border-gray-200 text-gray-600 hover:bg-gray-50">
                  Load More Articles
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-20 bg-white shadow-sm rounded-2xl border border-gray-200">
              <p className="text-gray-500">No blog posts published yet.</p>
            </div>
          )}
        </section>

        {/* Newsletter */}
        <section>
          <BlogNewsletter />
        </section>

      </div>
    </div>
  );
}
