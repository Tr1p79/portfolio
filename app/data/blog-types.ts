// app/data/blog-types.ts
export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  publishedAt: string
  updatedAt?: string
  category: string
  tags: string[]
  featuredImage: string
  readTime: number
  likes: number
  views: number
  featured: boolean
  published: boolean
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description: string
  color: string
}

// app/data/blog-categories.ts
export const blogCategories: BlogCategory[] = [
  {
    id: '1',
    name: 'Digital Art',
    slug: 'digital-art',
    description: 'Insights into digital art creation and techniques',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: '2',
    name: '3D Modeling',
    slug: '3d-modeling',
    description: 'Tips and tutorials for 3D modeling and animation',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: '3',
    name: 'Creative Process',
    slug: 'creative-process',
    description: 'Behind the scenes of artistic creation',
    color: 'from-emerald-500 to-teal-500'
  },
  {
    id: '4',
    name: 'Industry Insights',
    slug: 'industry-insights',
    description: 'Thoughts on the creative industry and trends',
    color: 'from-orange-500 to-red-500'
  },
  {
    id: '5',
    name: 'Tutorials',
    slug: 'tutorials',
    description: 'Step-by-step guides and learning resources',
    color: 'from-indigo-500 to-purple-500'
  }
]

// app/data/sample-posts.ts
export const sampleBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of Digital Art: AI and Human Creativity',
    slug: 'future-digital-art-ai-creativity',
    excerpt: 'Exploring how artificial intelligence is reshaping the creative landscape and what it means for digital artists.',
    content: `# The Future of Digital Art: AI and Human Creativity

The intersection of artificial intelligence and digital art has become one of the most fascinating and controversial topics in the creative world. As an artist who has witnessed the evolution of digital tools over the years, I find myself both excited and thoughtful about where we're heading.

## The Current Landscape

AI tools like Midjourney, DALL-E, and Stable Diffusion have democratized art creation in unprecedented ways. What once required years of training can now be achieved with a well-crafted prompt. But does this diminish the value of traditional artistic skills?

## Finding Balance

I believe the future lies not in replacement, but in collaboration. AI can serve as a powerful tool for:

- **Rapid ideation and concept exploration**
- **Generating references and inspiration**
- **Automating repetitive tasks**
- **Pushing creative boundaries**

However, the human element remains irreplaceable:

- **Emotional depth and personal experience**
- **Cultural context and storytelling**
- **Intentional artistic choices**
- **Technical refinement and craftsmanship**

## My Approach

In my own work, I've started incorporating AI as a collaborative partner rather than a replacement. I use it for initial concept exploration, then apply traditional digital painting techniques to refine and personalize the results.

## Looking Forward

The artists who will thrive in this new era are those who embrace these tools while maintaining their unique voice and vision. Technology should amplify our creativity, not define it.

What are your thoughts on AI in art? I'd love to hear your perspective in the comments below.`,
    author: 'Your Name',
    publishedAt: '2024-06-15T10:00:00Z',
    category: 'Digital Art',
    tags: ['AI', 'Digital Art', 'Future', 'Technology', 'Creativity'],
    featuredImage: '/images/blog/ai-digital-art.jpg',
    readTime: 8,
    likes: 156,
    views: 2340,
    featured: true,
    published: true
  },
  {
    id: '2',
    title: 'Mastering Lighting in 3D Environments',
    slug: 'mastering-lighting-3d-environments',
    excerpt: 'A comprehensive guide to creating realistic and atmospheric lighting in your 3D scenes.',
    content: `# Mastering Lighting in 3D Environments

Lighting is arguably the most important aspect of creating believable and emotionally engaging 3D environments. It can make or break the mood of your scene and greatly impact the viewer's experience.

## Understanding Light Types

### Key Light
The main source of illumination in your scene. This could be:
- Natural sunlight
- A lamp or artificial light source
- Fire or other emissive objects

### Fill Light
Softer secondary lighting that fills in shadows and provides detail in darker areas.

### Rim Light
Creates separation between your subject and background, adding depth and drama.

## Practical Techniques

### 1. Start with Real-World References
Always begin by studying how light behaves in reality. Take photos, observe shadows, and note how different materials reflect light.

### 2. Use HDRI for Realistic Environmental Lighting
High Dynamic Range Images provide natural, realistic lighting that can instantly improve your scenes.

### 3. Control Your Shadows
Shadows are just as important as the lights themselves. They provide depth and help ground your objects in the scene.

### 4. Color Temperature Matters
Warm lights (orange/yellow) create cozy, intimate feelings, while cool lights (blue/white) feel more clinical or dramatic.

## Common Mistakes to Avoid

- Over-lighting your scene
- Ignoring bounce light
- Using pure white lights
- Placing lights randomly without purpose

## Tools and Software

I primarily work with:
- **Blender** for most 3D work
- **KeyShot** for quick, high-quality renders
- **Substance Painter** for material authoring

The key is to understand the principles rather than rely on any specific software.

Remember, lighting is an art form that requires practice and experimentation. Don't be afraid to break rules once you understand them!`,
    author: 'Your Name',
    publishedAt: '2024-06-10T14:30:00Z',
    category: '3D Modeling',
    tags: ['3D', 'Lighting', 'Tutorial', 'Blender', 'Rendering'],
    featuredImage: '/images/blog/3d-lighting.jpg',
    readTime: 12,
    likes: 234,
    views: 1890,
    featured: true,
    published: true
  },
  {
    id: '3',
    title: 'From Sketch to Masterpiece: My Creative Workflow',
    slug: 'sketch-to-masterpiece-creative-workflow',
    excerpt: 'Take a behind-the-scenes look at how I approach creating digital art from initial concept to final piece.',
    content: `# From Sketch to Masterpiece: My Creative Workflow

Every artist has their own unique approach to creating art. Today, I want to share my personal workflow that has evolved over years of digital art creation.

## Phase 1: Ideation and Research

Everything starts with an idea. Sometimes it's a fleeting moment of inspiration, other times it's a carefully planned concept. I always begin with:

- **Mood boards** for visual inspiration
- **Reference gathering** from photos, artwork, and real life
- **Thumbnail sketches** to explore composition

## Phase 2: Initial Sketch

Using a large, soft brush, I lay down the basic shapes and composition. This stage is all about:
- Getting the proportions right
- Establishing the overall flow
- Testing different arrangements

I keep these sketches very loose and don't worry about details.

## Phase 3: Value Study

Before diving into color, I create a grayscale version to work out:
- Light and shadow relationships
- Contrast and focal points
- Overall readability

This step is crucial and often overlooked by beginners.

## Phase 4: Color Exploration

Now comes the fun part! I experiment with different color palettes:
- Warm vs cool color schemes
- Complementary color relationships
- Atmospheric perspective

I often create multiple versions before settling on the final palette.

## Phase 5: Refinement and Details

This is where the magic happens:
- Adding textures and surface details
- Refining edges and transitions
- Adjusting colors and values
- Adding special effects if needed

## Phase 6: Final Polish

The last 10% that makes all the difference:
- Color correction
- Final contrast adjustments
- Sharpening details
- Adding signature and final touches

## Tools I Use

- **Primary Software**: Photoshop
- **Sketching**: Procreate on iPad
- **Color Reference**: Coolors.co
- **Hardware**: Wacom Cintiq 22HD

## Time Management

A typical piece takes me 15-25 hours spread over several days. I find taking breaks helps me see the work with fresh eyes.

What's your creative process like? I'd love to hear about different approaches in the comments!`,
    author: 'Your Name',
    publishedAt: '2024-06-05T09:15:00Z',
    category: 'Creative Process',
    tags: ['Workflow', 'Digital Art', 'Process', 'Tips', 'Behind the Scenes'],
    featuredImage: '/images/blog/creative-workflow.jpg',
    readTime: 10,
    likes: 189,
    views: 1456,
    featured: false,
    published: true
  },
  {
    id: '4',
    title: 'The Rise of NFTs: Digital Art in the Blockchain Era',
    slug: 'rise-nfts-digital-art-blockchain',
    excerpt: 'Examining the impact of NFTs on the digital art market and what it means for creators.',
    content: `# The Rise of NFTs: Digital Art in the Blockchain Era

The Non-Fungible Token (NFT) phenomenon has fundamentally changed how we think about digital art ownership and value. As someone who has navigated this space since its early days, I want to share my perspective on this revolutionary technology.

## What Are NFTs Really?

Beyond the hype and speculation, NFTs represent a way to verify ownership and authenticity of digital assets. For digital artists, this solves a long-standing problem: how do you create scarcity in an infinitely copyable medium?

## The Good

### New Revenue Streams
NFTs have opened up entirely new ways for artists to monetize their work:
- Primary sales of original pieces
- Royalties on secondary sales
- Utility-based projects
- Community-driven initiatives

### Global Accessibility
The barriers to entering the art market have been significantly lowered. Artists from anywhere in the world can now reach collectors directly.

### Creative Innovation
The technology has pushed artists to explore new formats and interactive experiences that weren't possible before.

## The Challenges

### Environmental Concerns
While many blockchains have moved to more energy-efficient systems, environmental impact remains a consideration.

### Market Volatility
The speculative nature of the market can overshadow the artistic value of the work.

### Technical Barriers
Understanding blockchain technology and navigating various platforms can be overwhelming for newcomers.

## My NFT Journey

I entered the NFT space in 2021 with a collection of digital landscapes. The experience taught me valuable lessons about:
- Community building
- Marketing digital art
- The importance of storytelling
- Balancing art and business

## Best Practices for NFT Artists

### 1. Focus on Quality
Create art you're proud of, regardless of market trends.

### 2. Build Community
Engage with collectors and other artists. The social aspect is crucial.

### 3. Choose Your Platform Wisely
Different platforms serve different types of art and audiences.

### 4. Understand the Technology
You don't need to be a blockchain expert, but understanding the basics helps.

## Looking Forward

NFTs are just one application of blockchain technology in art. I believe we'll see continued innovation in:
- Digital ownership and provenance
- Programmable art that evolves over time
- Cross-platform interoperability
- Integration with virtual and augmented reality

## Final Thoughts

Whether you love them or hate them, NFTs have permanently changed the digital art landscape. The key is to approach them as a tool rather than an end in themselves.

What matters most is creating meaningful art that resonates with people. The technology should serve the art, not the other way around.

Have you experimented with NFTs? I'd love to hear about your experiences!`,
    author: 'Your Name',
    publishedAt: '2024-05-28T16:45:00Z',
    category: 'Industry Insights',
    tags: ['NFT', 'Blockchain', 'Digital Art', 'Crypto', 'Market'],
    featuredImage: '/images/blog/nft-digital-art.jpg',
    readTime: 15,
    likes: 298,
    views: 3210,
    featured: true,
    published: true
  },
  {
    id: '5',
    title: 'Color Theory for Digital Artists: A Practical Guide',
    slug: 'color-theory-digital-artists-guide',
    excerpt: 'Understanding color relationships and how to use them effectively in your digital artwork.',
    content: `# Color Theory for Digital Artists: A Practical Guide

Color is one of the most powerful tools in an artist's arsenal. Understanding how colors work together can dramatically improve your artwork and help you convey specific moods and emotions.

## The Color Wheel Basics

### Primary Colors
Red, blue, and yellow form the foundation of all other colors.

### Secondary Colors
Green, orange, and purple are created by mixing primary colors.

### Tertiary Colors
These are created by mixing primary and secondary colors, giving us 12 colors total on the traditional color wheel.

## Color Relationships

### Complementary Colors
Colors opposite each other on the wheel create high contrast and vibrant combinations:
- Red and Green
- Blue and Orange
- Yellow and Purple

### Analogous Colors
Colors next to each other create harmonious, pleasing combinations.

### Triadic Colors
Three colors equally spaced on the wheel create vibrant yet balanced palettes.

## Color Properties

### Hue
The pure color itself (red, blue, green, etc.)

### Saturation
The intensity or purity of the color. High saturation = vivid, low saturation = muted.

### Value
How light or dark a color is. This is crucial for creating depth and contrast.

## Practical Applications

### Setting Mood
- **Warm colors** (reds, oranges, yellows) create energy and excitement
- **Cool colors** (blues, greens, purples) create calm and tranquility
- **Desaturated colors** create sophisticated, serious moods
- **High contrast** creates drama and tension

### Creating Depth
- Warm colors appear closer
- Cool colors recede into the background
- Higher contrast elements come forward
- Lower contrast elements recede

## Digital Color Considerations

### Color Spaces
Understanding RGB vs CMYK vs sRGB is crucial for digital artists:
- **RGB**: For screen display
- **CMYK**: For print
- **sRGB**: Standard web color space

### Monitor Calibration
Ensure your monitor displays colors accurately to avoid surprises when sharing your work.

### Color Accessibility
Consider colorblind viewers when choosing color combinations.

## My Color Workflow

1. **Start with a limited palette** (3-5 colors max)
2. **Establish values first** in grayscale
3. **Apply base colors** using color overlay or multiply layers
4. **Adjust saturation and hue** for mood
5. **Add accent colors** sparingly for focal points

## Common Mistakes

- Using too many colors
- Ignoring value relationships
- Making everything equally saturated
- Not considering the viewing environment

## Recommended Tools

- **Adobe Color**: For creating color palettes
- **Coolors.co**: Quick palette generation
- **Paletton**: Advanced color scheme designer
- **Color Oracle**: Colorblind simulation

## Practice Exercises

1. **Monochromatic studies**: Create art using only one hue with different values and saturations
2. **Complementary challenges**: Force yourself to use only complementary colors
3. **Master studies**: Analyze and recreate the color palettes of master artists
4. **Photo studies**: Extract color palettes from photographs you admire

Remember, color theory provides guidelines, not rules. Once you understand the principles, don't be afraid to break them for artistic effect!

Color is emotional and personal. Trust your instincts while building your technical foundation.`,
    author: 'Your Name',
    publishedAt: '2024-05-20T11:20:00Z',
    category: 'Tutorials',
    tags: ['Color Theory', 'Tutorial', 'Digital Art', 'Basics', 'Design'],
    featuredImage: '/images/blog/color-theory.jpg',
    readTime: 18,
    likes: 445,
    views: 2876,
    featured: false,
    published: true
  }
]