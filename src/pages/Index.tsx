import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

type Product = {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  badge?: string;
};

type CartItem = Product & { quantity: number };

type User = {
  email: string;
  name: string;
  phone?: string;
};

const Index = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'catalog' | 'cart' | 'favorites' | 'profile' | 'orders' | 'admin'>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const { toast } = useToast();

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [showAdminProductDialog, setShowAdminProductDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [adminProducts, setAdminProducts] = useState<Product[]>([]);
  
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productOldPrice, setProductOldPrice] = useState('');
  const [productImage, setProductImage] = useState('');
  const [productBadge, setProductBadge] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('onlishop_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    const savedProducts = localStorage.getItem('onlishop_admin_products');
    if (savedProducts) {
      setAdminProducts(JSON.parse(savedProducts));
    }
  }, []);

  const isAdmin = user?.email === 'onlishop@mail.ru';

  const openAddProductDialog = () => {
    setEditingProduct(null);
    setProductName('');
    setProductPrice('');
    setProductOldPrice('');
    setProductImage('');
    setProductBadge('');
    setShowAdminProductDialog(true);
  };

  const openEditProductDialog = (product: Product) => {
    setEditingProduct(product);
    setProductName(product.name);
    setProductPrice(product.price.toString());
    setProductOldPrice(product.oldPrice?.toString() || '');
    setProductImage(product.image);
    setProductBadge(product.badge || '');
    setShowAdminProductDialog(true);
  };

  const saveProduct = () => {
    if (!productName || !productPrice || !productImage) {
      toast({ title: 'Ошибка', description: 'Заполните обязательные поля', variant: 'destructive' });
      return;
    }

    const productData: Product = {
      id: editingProduct?.id || Date.now(),
      name: productName,
      price: parseInt(productPrice),
      oldPrice: productOldPrice ? parseInt(productOldPrice) : undefined,
      image: productImage,
      rating: editingProduct?.rating || 4.5,
      reviews: editingProduct?.reviews || 0,
      badge: productBadge || undefined,
    };

    let updatedProducts;
    if (editingProduct) {
      updatedProducts = adminProducts.map(p => p.id === editingProduct.id ? productData : p);
      toast({ title: 'Товар обновлён!' });
    } else {
      updatedProducts = [...adminProducts, productData];
      toast({ title: 'Товар добавлен!' });
    }

    setAdminProducts(updatedProducts);
    localStorage.setItem('onlishop_admin_products', JSON.stringify(updatedProducts));
    setShowAdminProductDialog(false);
  };

  const deleteProduct = (productId: number) => {
    const updatedProducts = adminProducts.filter(p => p.id !== productId);
    setAdminProducts(updatedProducts);
    localStorage.setItem('onlishop_admin_products', JSON.stringify(updatedProducts));
    toast({ title: 'Товар удалён' });
  };

  const handleLogin = () => {
    if (!loginEmail || !loginPassword) {
      toast({ title: 'Ошибка', description: 'Заполните все поля', variant: 'destructive' });
      return;
    }
    const savedUsers = JSON.parse(localStorage.getItem('onlishop_users') || '[]');
    const foundUser = savedUsers.find((u: any) => u.email === loginEmail && u.password === loginPassword);
    if (foundUser) {
      const userData = { email: foundUser.email, name: foundUser.name, phone: foundUser.phone };
      setUser(userData);
      localStorage.setItem('onlishop_user', JSON.stringify(userData));
      setShowAuthDialog(false);
      toast({ title: 'Успешно!', description: `Добро пожаловать, ${foundUser.name}!` });
      setLoginEmail('');
      setLoginPassword('');
    } else {
      toast({ title: 'Ошибка', description: 'Неверный email или пароль', variant: 'destructive' });
    }
  };

  const handleRegister = () => {
    if (!registerName || !registerEmail || !registerPassword) {
      toast({ title: 'Ошибка', description: 'Заполните все обязательные поля', variant: 'destructive' });
      return;
    }
    const savedUsers = JSON.parse(localStorage.getItem('onlishop_users') || '[]');
    if (savedUsers.find((u: any) => u.email === registerEmail)) {
      toast({ title: 'Ошибка', description: 'Пользователь с таким email уже существует', variant: 'destructive' });
      return;
    }
    const newUser = { email: registerEmail, password: registerPassword, name: registerName, phone: registerPhone };
    savedUsers.push(newUser);
    localStorage.setItem('onlishop_users', JSON.stringify(savedUsers));
    const userData = { email: registerEmail, name: registerName, phone: registerPhone };
    setUser(userData);
    localStorage.setItem('onlishop_user', JSON.stringify(userData));
    setShowAuthDialog(false);
    toast({ title: 'Регистрация успешна!', description: `Добро пожаловать, ${registerName}!` });
    setRegisterName('');
    setRegisterEmail('');
    setRegisterPassword('');
    setRegisterPhone('');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('onlishop_user');
    toast({ title: 'Вы вышли из аккаунта' });
  };

  const categories = [
    { name: 'Электроника', icon: 'Laptop' },
    { name: 'Одежда', icon: 'ShoppingBag' },
    { name: 'Обувь', icon: 'Footprints' },
    { name: 'Спорт', icon: 'Dumbbell' },
    { name: 'Красота', icon: 'Sparkles' },
    { name: 'Дом', icon: 'Home' },
    { name: 'Игрушки', icon: 'Gamepad2' },
    { name: 'Книги', icon: 'Book' },
  ];

  const products: Product[] = [
    {
      id: 1,
      name: 'iPhone 17 Pro Max 2TB Titanium',
      price: 120000,
      oldPrice: 145000,
      image: 'https://cdn.poehali.dev/projects/55ac4ef1-1b9a-4e49-9d71-5aabccf6d987/files/9db21f14-8a22-4cb3-8b7a-9c42c7d1d9e3.jpg',
      rating: 5.0,
      reviews: 3421,
      badge: 'Новинка'
    },
    {
      id: 2,
      name: 'MacBook Pro 16" M4 Max 64GB',
      price: 289990,
      oldPrice: 329990,
      image: 'https://cdn.poehali.dev/projects/55ac4ef1-1b9a-4e49-9d71-5aabccf6d987/files/28583c73-2996-40f0-8f8a-741fd3773e75.jpg',
      rating: 4.9,
      reviews: 1567,
      badge: 'Хит продаж'
    },
    {
      id: 3,
      name: 'iPad Pro 13" M4 2TB Wi-Fi + Cellular',
      price: 159990,
      oldPrice: 179990,
      image: 'https://cdn.poehali.dev/projects/55ac4ef1-1b9a-4e49-9d71-5aabccf6d987/files/9db21f14-8a22-4cb3-8b7a-9c42c7d1d9e3.jpg',
      rating: 4.8,
      reviews: 987,
      badge: 'Скидка -11%'
    },
    {
      id: 4,
      name: 'AirPods Pro 3 с USB-C',
      price: 24990,
      oldPrice: 29990,
      image: 'https://cdn.poehali.dev/projects/55ac4ef1-1b9a-4e49-9d71-5aabccf6d987/files/28583c73-2996-40f0-8f8a-741fd3773e75.jpg',
      rating: 4.9,
      reviews: 5432,
      badge: 'Хит продаж'
    },
    {
      id: 5,
      name: 'Apple Watch Ultra 3',
      price: 89990,
      oldPrice: 99990,
      image: 'https://cdn.poehali.dev/projects/55ac4ef1-1b9a-4e49-9d71-5aabccf6d987/files/28583c73-2996-40f0-8f8a-741fd3773e75.jpg',
      rating: 4.8,
      reviews: 2134,
    },
    {
      id: 6,
      name: 'iPhone 16 Pro 512GB',
      price: 99990,
      oldPrice: 119990,
      image: 'https://cdn.poehali.dev/projects/55ac4ef1-1b9a-4e49-9d71-5aabccf6d987/files/9db21f14-8a22-4cb3-8b7a-9c42c7d1d9e3.jpg',
      rating: 4.9,
      reviews: 4521,
      badge: 'Скидка -17%'
    },
    {
      id: 7,
      name: 'MacBook Air 15" M3 16GB',
      price: 139990,
      oldPrice: 159990,
      image: 'https://cdn.poehali.dev/projects/55ac4ef1-1b9a-4e49-9d71-5aabccf6d987/files/28583c73-2996-40f0-8f8a-741fd3773e75.jpg',
      rating: 4.8,
      reviews: 1876,
    },
    {
      id: 8,
      name: 'AirPods Max 2',
      price: 69990,
      oldPrice: 79990,
      image: 'https://cdn.poehali.dev/projects/55ac4ef1-1b9a-4e49-9d71-5aabccf6d987/files/28583c73-2996-40f0-8f8a-741fd3773e75.jpg',
      rating: 4.7,
      reviews: 891,
    },
    {
      id: 9,
      name: 'iPhone 15 256GB',
      price: 74990,
      oldPrice: 89990,
      image: 'https://cdn.poehali.dev/projects/55ac4ef1-1b9a-4e49-9d71-5aabccf6d987/files/9db21f14-8a22-4cb3-8b7a-9c42c7d1d9e3.jpg',
      rating: 4.8,
      reviews: 6234,
      badge: 'Скидка -17%'
    },
    {
      id: 10,
      name: 'iPad Air 11" M2 256GB',
      price: 64990,
      oldPrice: 74990,
      image: 'https://cdn.poehali.dev/projects/55ac4ef1-1b9a-4e49-9d71-5aabccf6d987/files/9db21f14-8a22-4cb3-8b7a-9c42c7d1d9e3.jpg',
      rating: 4.7,
      reviews: 1432,
    },
    {
      id: 11,
      name: 'Apple TV 4K 128GB',
      price: 14990,
      image: 'https://cdn.poehali.dev/projects/55ac4ef1-1b9a-4e49-9d71-5aabccf6d987/files/28583c73-2996-40f0-8f8a-741fd3773e75.jpg',
      rating: 4.6,
      reviews: 543,
    },
    {
      id: 12,
      name: 'Magic Keyboard для iPad Pro 13"',
      price: 39990,
      oldPrice: 44990,
      image: 'https://cdn.poehali.dev/projects/55ac4ef1-1b9a-4e49-9d71-5aabccf6d987/files/28583c73-2996-40f0-8f8a-741fd3773e75.jpg',
      rating: 4.5,
      reviews: 234,
    },
    {
      id: 13,
      name: 'Apple Pencil Pro',
      price: 13990,
      image: 'https://cdn.poehali.dev/projects/55ac4ef1-1b9a-4e49-9d71-5aabccf6d987/files/28583c73-2996-40f0-8f8a-741fd3773e75.jpg',
      rating: 4.8,
      reviews: 876,
      badge: 'Новинка'
    },
    {
      id: 14,
      name: 'Беспроводные наушники JBL Tune 770NC',
      price: 8990,
      oldPrice: 12990,
      image: 'https://cdn.poehali.dev/projects/55ac4ef1-1b9a-4e49-9d71-5aabccf6d987/files/28583c73-2996-40f0-8f8a-741fd3773e75.jpg',
      rating: 4.6,
      reviews: 3421,
      badge: 'Скидка -31%'
    },
    {
      id: 15,
      name: 'Смартфон Samsung Galaxy S24 Ultra 512GB',
      price: 109990,
      oldPrice: 129990,
      image: 'https://cdn.poehali.dev/projects/55ac4ef1-1b9a-4e49-9d71-5aabccf6d987/files/9db21f14-8a22-4cb3-8b7a-9c42c7d1d9e3.jpg',
      rating: 4.8,
      reviews: 2134,
      badge: 'Хит продаж'
    },
    {
      id: 16,
      name: 'Ноутбук ASUS ROG Zephyrus G16',
      price: 189990,
      oldPrice: 219990,
      image: 'https://cdn.poehali.dev/projects/55ac4ef1-1b9a-4e49-9d71-5aabccf6d987/files/28583c73-2996-40f0-8f8a-741fd3773e75.jpg',
      rating: 4.7,
      reviews: 765,
    },
    {
      id: 17,
      name: 'Планшет Samsung Galaxy Tab S9+ 256GB',
      price: 79990,
      oldPrice: 94990,
      image: 'https://cdn.poehali.dev/projects/55ac4ef1-1b9a-4e49-9d71-5aabccf6d987/files/9db21f14-8a22-4cb3-8b7a-9c42c7d1d9e3.jpg',
      rating: 4.6,
      reviews: 543,
    },
    {
      id: 18,
      name: 'Умные часы Samsung Galaxy Watch 6 Classic',
      price: 32990,
      oldPrice: 39990,
      image: 'https://cdn.poehali.dev/projects/55ac4ef1-1b9a-4e49-9d71-5aabccf6d987/files/28583c73-2996-40f0-8f8a-741fd3773e75.jpg',
      rating: 4.5,
      reviews: 987,
    },
    {
      id: 19,
      name: 'Телевизор LG OLED 65" 4K Smart TV',
      price: 149990,
      oldPrice: 179990,
      image: 'https://cdn.poehali.dev/projects/55ac4ef1-1b9a-4e49-9d71-5aabccf6d987/files/28583c73-2996-40f0-8f8a-741fd3773e75.jpg',
      rating: 4.9,
      reviews: 1234,
      badge: 'Скидка -17%'
    },
    {
      id: 20,
      name: 'PlayStation 5 Slim 1TB',
      price: 54990,
      oldPrice: 64990,
      image: 'https://cdn.poehali.dev/projects/55ac4ef1-1b9a-4e49-9d71-5aabccf6d987/files/28583c73-2996-40f0-8f8a-741fd3773e75.jpg',
      rating: 4.9,
      reviews: 5678,
      badge: 'Хит продаж'
    },
    {
      id: 21,
      name: 'Фотоаппарат Sony Alpha A7 IV Body',
      price: 219990,
      image: 'https://cdn.poehali.dev/projects/55ac4ef1-1b9a-4e49-9d71-5aabccf6d987/files/28583c73-2996-40f0-8f8a-741fd3773e75.jpg',
      rating: 4.9,
      reviews: 432,
    },
    {
      id: 22,
      name: 'Робот-пылесос Xiaomi S10+',
      price: 39990,
      oldPrice: 49990,
      image: 'https://cdn.poehali.dev/projects/55ac4ef1-1b9a-4e49-9d71-5aabccf6d987/files/28583c73-2996-40f0-8f8a-741fd3773e75.jpg',
      rating: 4.7,
      reviews: 2345,
      badge: 'Скидка -20%'
    },
    {
      id: 23,
      name: 'Электросамокат Ninebot KickScooter Max G2',
      price: 54990,
      oldPrice: 64990,
      image: 'https://cdn.poehali.dev/projects/55ac4ef1-1b9a-4e49-9d71-5aabccf6d987/files/a2feeeeb-3873-483a-b423-353e27c11ca1.jpg',
      rating: 4.6,
      reviews: 876,
    },
    {
      id: 24,
      name: 'Кроссовки Nike Air Max 270',
      price: 12990,
      oldPrice: 16990,
      image: 'https://cdn.poehali.dev/projects/55ac4ef1-1b9a-4e49-9d71-5aabccf6d987/files/a2feeeeb-3873-483a-b423-353e27c11ca1.jpg',
      rating: 4.8,
      reviews: 4532,
      badge: 'Скидка -24%'
    },
    {
      id: 25,
      name: 'Кроссовки Adidas Ultraboost 23',
      price: 15990,
      oldPrice: 19990,
      image: 'https://cdn.poehali.dev/projects/55ac4ef1-1b9a-4e49-9d71-5aabccf6d987/files/a2feeeeb-3873-483a-b423-353e27c11ca1.jpg',
      rating: 4.7,
      reviews: 3421,
    },
    {
      id: 26,
      name: 'Куртка The North Face 1996 Retro Nuptse',
      price: 32990,
      oldPrice: 39990,
      image: 'https://cdn.poehali.dev/projects/55ac4ef1-1b9a-4e49-9d71-5aabccf6d987/files/a2feeeeb-3873-483a-b423-353e27c11ca1.jpg',
      rating: 4.9,
      reviews: 1234,
      badge: 'Хит продаж'
    },
    {
      id: 27,
      name: 'Рюкзак Xiaomi Mi Business Backpack 2',
      price: 2990,
      oldPrice: 3990,
      image: 'https://cdn.poehali.dev/projects/55ac4ef1-1b9a-4e49-9d71-5aabccf6d987/files/28583c73-2996-40f0-8f8a-741fd3773e75.jpg',
      rating: 4.6,
      reviews: 5678,
    },
    {
      id: 28,
      name: 'Кофемашина DeLonghi Magnifica S',
      price: 54990,
      oldPrice: 69990,
      image: 'https://cdn.poehali.dev/projects/55ac4ef1-1b9a-4e49-9d71-5aabccf6d987/files/28583c73-2996-40f0-8f8a-741fd3773e75.jpg',
      rating: 4.8,
      reviews: 987,
      badge: 'Скидка -21%'
    },
    {
      id: 29,
      name: 'Мультиварка Redmond RMC-M250',
      price: 7990,
      oldPrice: 9990,
      image: 'https://cdn.poehali.dev/projects/55ac4ef1-1b9a-4e49-9d71-5aabccf6d987/files/28583c73-2996-40f0-8f8a-741fd3773e75.jpg',
      rating: 4.5,
      reviews: 3421,
    },
    {
      id: 30,
      name: 'Блендер Vitamix A3500',
      price: 64990,
      image: 'https://cdn.poehali.dev/projects/55ac4ef1-1b9a-4e49-9d71-5aabccf6d987/files/28583c73-2996-40f0-8f8a-741fd3773e75.jpg',
      rating: 4.9,
      reviews: 234,
    },
    {
      id: 31,
      name: 'Электрическая зубная щетка Oral-B iO 9',
      price: 24990,
      oldPrice: 29990,
      image: 'https://cdn.poehali.dev/projects/55ac4ef1-1b9a-4e49-9d71-5aabccf6d987/files/28583c73-2996-40f0-8f8a-741fd3773e75.jpg',
      rating: 4.8,
      reviews: 1876,
    },
    {
      id: 32,
      name: 'Фен Dyson Supersonic',
      price: 34990,
      oldPrice: 39990,
      image: 'https://cdn.poehali.dev/projects/55ac4ef1-1b9a-4e49-9d71-5aabccf6d987/files/28583c73-2996-40f0-8f8a-741fd3773e75.jpg',
      rating: 4.7,
      reviews: 765,
      badge: 'Скидка -13%'
    },
    {
      id: 33,
      name: 'Массажное кресло Xiaomi Momoda SX383',
      price: 89990,
      oldPrice: 109990,
      image: 'https://cdn.poehali.dev/projects/55ac4ef1-1b9a-4e49-9d71-5aabccf6d987/files/28583c73-2996-40f0-8f8a-741fd3773e75.jpg',
      rating: 4.6,
      reviews: 432,
    },
    {
      id: 34,
      name: 'Умная колонка Яндекс Станция Макс',
      price: 24990,
      oldPrice: 29990,
      image: 'https://cdn.poehali.dev/projects/55ac4ef1-1b9a-4e49-9d71-5aabccf6d987/files/28583c73-2996-40f0-8f8a-741fd3773e75.jpg',
      rating: 4.5,
      reviews: 2134,
    },
    {
      id: 35,
      name: 'Клавиатура Logitech MX Keys',
      price: 12990,
      oldPrice: 14990,
      image: 'https://cdn.poehali.dev/projects/55ac4ef1-1b9a-4e49-9d71-5aabccf6d987/files/28583c73-2996-40f0-8f8a-741fd3773e75.jpg',
      rating: 4.8,
      reviews: 1234,
    },
    {
      id: 36,
      name: 'Мышь Logitech MX Master 3S',
      price: 9990,
      oldPrice: 11990,
      image: 'https://cdn.poehali.dev/projects/55ac4ef1-1b9a-4e49-9d71-5aabccf6d987/files/28583c73-2996-40f0-8f8a-741fd3773e75.jpg',
      rating: 4.9,
      reviews: 3421,
      badge: 'Хит продаж'
    },
    {
      id: 37,
      name: 'Монитор Dell UltraSharp 27" 4K',
      price: 64990,
      oldPrice: 74990,
      image: 'https://cdn.poehali.dev/projects/55ac4ef1-1b9a-4e49-9d71-5aabccf6d987/files/28583c73-2996-40f0-8f8a-741fd3773e75.jpg',
      rating: 4.7,
      reviews: 876,
    },
    {
      id: 38,
      name: 'Веб-камера Logitech Brio 4K',
      price: 19990,
      oldPrice: 24990,
      image: 'https://cdn.poehali.dev/projects/55ac4ef1-1b9a-4e49-9d71-5aabccf6d987/files/28583c73-2996-40f0-8f8a-741fd3773e75.jpg',
      rating: 4.6,
      reviews: 543,
    },
    {
      id: 39,
      name: 'Микрофон Blue Yeti X',
      price: 16990,
      oldPrice: 19990,
      image: 'https://cdn.poehali.dev/projects/55ac4ef1-1b9a-4e49-9d71-5aabccf6d987/files/28583c73-2996-40f0-8f8a-741fd3773e75.jpg',
      rating: 4.8,
      reviews: 987,
    },
    {
      id: 40,
      name: 'SSD Samsung 990 PRO 2TB',
      price: 19990,
      oldPrice: 24990,
      image: 'https://cdn.poehali.dev/projects/55ac4ef1-1b9a-4e49-9d71-5aabccf6d987/files/28583c73-2996-40f0-8f8a-741fd3773e75.jpg',
      rating: 4.9,
      reviews: 1432,
      badge: 'Скидка -20%'
    },
    {
      id: 41,
      name: 'Внешний аккумулятор Xiaomi 20000 мАч',
      price: 2990,
      oldPrice: 3990,
      image: 'https://cdn.poehali.dev/projects/55ac4ef1-1b9a-4e49-9d71-5aabccf6d987/files/28583c73-2996-40f0-8f8a-741fd3773e75.jpg',
      rating: 4.7,
      reviews: 6234,
    },
    {
      id: 42,
      name: 'Зарядное устройство Anker 747 150W',
      price: 8990,
      oldPrice: 10990,
      image: 'https://cdn.poehali.dev/projects/55ac4ef1-1b9a-4e49-9d71-5aabccf6d987/files/28583c73-2996-40f0-8f8a-741fd3773e75.jpg',
      rating: 4.8,
      reviews: 765,
    },
    {
      id: 43,
      name: 'Умная лампа Xiaomi Mi LED Desk Lamp Pro',
      price: 4990,
      oldPrice: 5990,
      image: 'https://cdn.poehali.dev/projects/55ac4ef1-1b9a-4e49-9d71-5aabccf6d987/files/28583c73-2996-40f0-8f8a-741fd3773e75.jpg',
      rating: 4.6,
      reviews: 2134,
    },
    {
      id: 44,
      name: 'Умный дверной замок Xiaomi Smart Door Lock E10',
      price: 12990,
      oldPrice: 15990,
      image: 'https://cdn.poehali.dev/projects/55ac4ef1-1b9a-4e49-9d71-5aabccf6d987/files/28583c73-2996-40f0-8f8a-741fd3773e75.jpg',
      rating: 4.5,
      reviews: 543,
    },
    {
      id: 45,
      name: 'Умная камера Xiaomi Mi 360° 2K Pro',
      price: 4990,
      image: 'https://cdn.poehali.dev/projects/55ac4ef1-1b9a-4e49-9d71-5aabccf6d987/files/28583c73-2996-40f0-8f8a-741fd3773e75.jpg',
      rating: 4.7,
      reviews: 3421,
      badge: 'Новинка'
    },
    {
      id: 46,
      name: 'Увлажнитель воздуха Xiaomi Smart Humidifier 2',
      price: 6990,
      oldPrice: 8990,
      image: 'https://cdn.poehali.dev/projects/55ac4ef1-1b9a-4e49-9d71-5aabccf6d987/files/28583c73-2996-40f0-8f8a-741fd3773e75.jpg',
      rating: 4.6,
      reviews: 1876,
    },
    {
      id: 47,
      name: 'Очиститель воздуха Xiaomi Mi Air Purifier 4',
      price: 14990,
      oldPrice: 17990,
      image: 'https://cdn.poehali.dev/projects/55ac4ef1-1b9a-4e49-9d71-5aabccf6d987/files/28583c73-2996-40f0-8f8a-741fd3773e75.jpg',
      rating: 4.8,
      reviews: 987,
    },
    {
      id: 48,
      name: 'Настольная лампа Philips Hue Go',
      price: 7990,
      oldPrice: 9990,
      image: 'https://cdn.poehali.dev/projects/55ac4ef1-1b9a-4e49-9d71-5aabccf6d987/files/28583c73-2996-40f0-8f8a-741fd3773e75.jpg',
      rating: 4.5,
      reviews: 432,
    },
  ];

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, change: number) => {
    setCart(prev =>
      prev.map(item => {
        if (item.id === productId) {
          const newQuantity = item.quantity + change;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      }).filter(item => item.quantity > 0)
    );
  };

  const toggleFavorite = (productId: number) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const allProducts = [...products, ...adminProducts];

  const renderProductCard = (product: Product) => (
    <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow animate-fade-in">
      <div className="relative">
        <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
        {product.badge && (
          <Badge className="absolute top-2 left-2 bg-secondary">{product.badge}</Badge>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/90 hover:bg-white"
          onClick={() => toggleFavorite(product.id)}
        >
          <Icon
            name="Heart"
            size={20}
            className={favorites.includes(product.id) ? 'fill-red-500 text-red-500' : ''}
          />
        </Button>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-sm mb-2 line-clamp-2 h-10">{product.name}</h3>
        <div className="flex items-center gap-1 mb-2">
          <Icon name="Star" size={16} className="fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{product.rating}</span>
          <span className="text-xs text-muted-foreground">({product.reviews})</span>
        </div>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-xl font-bold">{product.price.toLocaleString()} ₽</span>
          {product.oldPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {product.oldPrice.toLocaleString()} ₽
            </span>
          )}
        </div>
        <Button className="w-full" onClick={() => addToCart(product)}>
          <Icon name="ShoppingCart" size={18} className="mr-2" />
          В корзину
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Icon name="ShoppingBag" size={32} />
              <h1 className="text-2xl font-bold">OnliShop</h1>
            </div>
            
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Input
                  placeholder="Искать товары..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white text-foreground pr-10"
                />
                <Icon name="Search" size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                className="text-primary-foreground hover:bg-primary/90"
                onClick={() => user ? setActiveTab('profile') : setShowAuthDialog(true)}
              >
                <Icon name="User" size={20} />
              </Button>
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary/90 relative" onClick={() => setActiveTab('cart')}>
                <Icon name="ShoppingCart" size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-card border-b sticky top-[60px] z-40">
        <div className="container mx-auto px-4">
          <div className="flex gap-6 overflow-x-auto py-3">
            {[
              { id: 'home', label: 'Главная', icon: 'Home' },
              { id: 'catalog', label: 'Каталог', icon: 'Grid3x3' },
              { id: 'cart', label: 'Корзина', icon: 'ShoppingCart' },
              { id: 'favorites', label: 'Избранное', icon: 'Heart' },
              { id: 'profile', label: 'Профиль', icon: 'User' },
              { id: 'orders', label: 'Заказы', icon: 'Package' },
              ...(isAdmin ? [{ id: 'admin', label: 'Админ-панель', icon: 'Settings' }] : []),
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                <Icon name={tab.icon as any} size={18} />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-6">
        {activeTab === 'home' && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white">
              <h2 className="text-4xl font-bold mb-2">Осенние скидки до 50%!</h2>
              <p className="text-lg mb-4">Успей купить товары по выгодным ценам</p>
              <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                Смотреть акции
              </Button>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Категории</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                {categories.map((category) => (
                  <Card
                    key={category.name}
                    className="p-4 hover:shadow-md transition-shadow cursor-pointer text-center"
                  >
                    <Icon name={category.icon as any} size={32} className="mx-auto mb-2 text-primary" />
                    <p className="text-sm font-medium">{category.name}</p>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Популярные товары</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {allProducts.slice(0, 8).map(renderProductCard)}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'catalog' && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">Каталог товаров</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {allProducts.map(renderProductCard)}
            </div>
          </div>
        )}

        {activeTab === 'cart' && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">Корзина</h2>
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="ShoppingCart" size={64} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg text-muted-foreground mb-4">Корзина пуста</p>
                <Button onClick={() => setActiveTab('catalog')}>Перейти в каталог</Button>
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  {cart.map((item) => (
                    <Card key={item.id} className="p-4">
                      <div className="flex gap-4">
                        <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded" />
                        <div className="flex-1">
                          <h3 className="font-medium mb-2">{item.name}</h3>
                          <p className="text-xl font-bold mb-2">{item.price.toLocaleString()} ₽</p>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(item.id, -1)}
                            >
                              <Icon name="Minus" size={16} />
                            </Button>
                            <span className="w-12 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              <Icon name="Plus" size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="ml-auto text-destructive"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Icon name="Trash2" size={18} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                <Card className="p-6 h-fit">
                  <h3 className="text-xl font-bold mb-4">Итого</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span>Товары ({cartCount})</span>
                      <span className="font-medium">{cartTotal.toLocaleString()} ₽</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Доставка</span>
                      <span>Бесплатно</span>
                    </div>
                  </div>
                  <div className="border-t pt-4 mb-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>К оплате</span>
                      <span>{cartTotal.toLocaleString()} ₽</span>
                    </div>
                  </div>
                  <Button className="w-full" size="lg">
                    Оформить заказ
                  </Button>
                </Card>
              </div>
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">Избранное</h2>
            {favorites.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="Heart" size={64} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg text-muted-foreground mb-4">Список избранного пуст</p>
                <Button onClick={() => setActiveTab('catalog')}>Перейти в каталог</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {allProducts.filter(p => favorites.includes(p.id)).map(renderProductCard)}
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="animate-fade-in max-w-2xl">
            <h2 className="text-2xl font-bold mb-6">Профиль</h2>
            {!user ? (
              <Card className="p-12 text-center">
                <Icon name="User" size={64} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-bold mb-2">Вы не авторизованы</h3>
                <p className="text-muted-foreground mb-6">Войдите или зарегистрируйтесь, чтобы получить доступ к профилю</p>
                <Button onClick={() => setShowAuthDialog(true)} size="lg">Войти</Button>
              </Card>
            ) : (
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center">
                    <Icon name="User" size={40} className="text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{user.name}</h3>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                  <Button variant="outline" onClick={handleLogout}>
                    <Icon name="LogOut" size={18} className="mr-2" />
                    Выйти
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Имя</Label>
                    <Input value={user.name} onChange={(e) => setUser({...user, name: e.target.value})} className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    <Input value={user.email} disabled className="mt-1 bg-muted" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Телефон</Label>
                    <Input value={user.phone || ''} onChange={(e) => setUser({...user, phone: e.target.value})} className="mt-1" />
                  </div>
                  <Button className="w-full" onClick={() => {
                    localStorage.setItem('onlishop_user', JSON.stringify(user));
                    toast({ title: 'Изменения сохранены!' });
                  }}>Сохранить изменения</Button>
                </div>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">Мои заказы</h2>
            <div className="space-y-4">
              {[
                { id: 12345, date: '15.10.2024', status: 'Доставляется', total: 12990, items: 2 },
                { id: 12344, date: '10.10.2024', status: 'Получен', total: 4990, items: 1 },
                { id: 12343, date: '05.10.2024', status: 'Получен', total: 67980, items: 3 },
              ].map((order) => (
                <Card key={order.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg">Заказ #{order.id}</h3>
                      <p className="text-sm text-muted-foreground">{order.date}</p>
                    </div>
                    <Badge variant={order.status === 'Доставляется' ? 'default' : 'secondary'}>
                      {order.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Товаров: {order.items}</p>
                      <p className="font-bold">{order.total.toLocaleString()} ₽</p>
                    </div>
                    <Button variant="outline">Подробнее</Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      {activeTab === 'admin' && isAdmin && (
        <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">Админ-панель</h2>
              <Button variant="outline" onClick={() => setActiveTab('home')}>
                <Icon name="X" size={18} className="mr-2" />
                Закрыть
              </Button>
            </div>

            <div className="grid gap-6 mb-6">
              <Card className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Управление товарами</h3>
                  <Button onClick={openAddProductDialog}>
                    <Icon name="Plus" size={18} className="mr-2" />
                    Добавить товар
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allProducts.map((product) => (
                    <Card key={product.id} className="p-4">
                      <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded mb-2" />
                      <h4 className="font-medium text-sm mb-1 line-clamp-2">{product.name}</h4>
                      <p className="text-lg font-bold mb-2">{product.price.toLocaleString()} ₽</p>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => openEditProductDialog(product)}
                          disabled={product.id < 1000}
                        >
                          <Icon name="Edit" size={14} className="mr-1" />
                          Изменить
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => deleteProduct(product.id)}
                          disabled={product.id < 1000}
                        >
                          <Icon name="Trash2" size={14} />
                        </Button>
                      </div>
                      {product.id < 1000 && (
                        <p className="text-xs text-muted-foreground mt-2">Базовый товар (нельзя изменить)</p>
                      )}
                    </Card>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Статистика</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <Icon name="Package" size={32} className="mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">{allProducts.length}</p>
                    <p className="text-sm text-muted-foreground">Товаров</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <Icon name="Users" size={32} className="mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">{JSON.parse(localStorage.getItem('onlishop_users') || '[]').length}</p>
                    <p className="text-sm text-muted-foreground">Пользователей</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <Icon name="ShoppingCart" size={32} className="mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-sm text-muted-foreground">Заказов</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <Icon name="TrendingUp" size={32} className="mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">0 ₽</p>
                    <p className="text-sm text-muted-foreground">Выручка</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Зарегистрированные пользователи</h3>
                <div className="space-y-2">
                  {JSON.parse(localStorage.getItem('onlishop_users') || '[]').map((u: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded">
                      <div>
                        <p className="font-medium">{u.name}</p>
                        <p className="text-sm text-muted-foreground">{u.email}</p>
                      </div>
                      {u.phone && <p className="text-sm">{u.phone}</p>}
                    </div>
                  ))}
                  {JSON.parse(localStorage.getItem('onlishop_users') || '[]').length === 0 && (
                    <p className="text-center text-muted-foreground py-8">Пока нет зарегистрированных пользователей</p>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      <Dialog open={showAdminProductDialog} onOpenChange={setShowAdminProductDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Редактировать товар' : 'Добавить товар'}</DialogTitle>
            <DialogDescription>
              Заполните информацию о товаре
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Название товара *</Label>
              <Input value={productName} onChange={(e) => setProductName(e.target.value)} className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Цена *</Label>
                <Input type="number" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>Старая цена</Label>
                <Input type="number" value={productOldPrice} onChange={(e) => setProductOldPrice(e.target.value)} className="mt-1" />
              </div>
            </div>
            <div>
              <Label>URL изображения *</Label>
              <Input value={productImage} onChange={(e) => setProductImage(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>Бейдж (необязательно)</Label>
              <Input value={productBadge} onChange={(e) => setProductBadge(e.target.value)} placeholder="Хит продаж, Новинка..." className="mt-1" />
            </div>
            <Button className="w-full" onClick={saveProduct}>
              {editingProduct ? 'Сохранить' : 'Добавить'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Добро пожаловать в OnliShop</DialogTitle>
            <DialogDescription>
              Войдите в аккаунт или создайте новый
            </DialogDescription>
          </DialogHeader>
          <Tabs value={authTab} onValueChange={(v) => setAuthTab(v as 'login' | 'register')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Вход</TabsTrigger>
              <TabsTrigger value="register">Регистрация</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="space-y-4">
              <div>
                <Label htmlFor="login-email">Email</Label>
                <Input 
                  id="login-email" 
                  type="email" 
                  placeholder="example@mail.ru" 
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="login-password">Пароль</Label>
                <Input 
                  id="login-password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button className="w-full" size="lg" onClick={handleLogin}>
                Войти
              </Button>
            </TabsContent>
            <TabsContent value="register" className="space-y-4">
              <div>
                <Label htmlFor="register-name">Имя *</Label>
                <Input 
                  id="register-name" 
                  placeholder="Иван Петров" 
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="register-email">Email *</Label>
                <Input 
                  id="register-email" 
                  type="email" 
                  placeholder="example@mail.ru" 
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="register-password">Пароль *</Label>
                <Input 
                  id="register-password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="register-phone">Телефон</Label>
                <Input 
                  id="register-phone" 
                  placeholder="+7 (999) 123-45-67" 
                  value={registerPhone}
                  onChange={(e) => setRegisterPhone(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button className="w-full" size="lg" onClick={handleRegister}>
                Зарегистрироваться
              </Button>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;