import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

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

const Index = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'catalog' | 'cart' | 'favorites' | 'profile' | 'orders'>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

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
      name: 'Беспроводные наушники Premium Sound',
      price: 4990,
      oldPrice: 6990,
      image: 'https://cdn.poehali.dev/projects/55ac4ef1-1b9a-4e49-9d71-5aabccf6d987/files/28583c73-2996-40f0-8f8a-741fd3773e75.jpg',
      rating: 4.8,
      reviews: 1243,
      badge: 'Хит продаж'
    },
    {
      id: 2,
      name: 'Смартфон Galaxy Pro Max 256GB',
      price: 59990,
      oldPrice: 69990,
      image: 'https://cdn.poehali.dev/projects/55ac4ef1-1b9a-4e49-9d71-5aabccf6d987/files/9db21f14-8a22-4cb3-8b7a-9c42c7d1d9e3.jpg',
      rating: 4.9,
      reviews: 856,
      badge: 'Скидка -14%'
    },
    {
      id: 3,
      name: 'Кроссовки спортивные Ultra Run',
      price: 7990,
      image: 'https://cdn.poehali.dev/projects/55ac4ef1-1b9a-4e49-9d71-5aabccf6d987/files/a2feeeeb-3873-483a-b423-353e27c11ca1.jpg',
      rating: 4.7,
      reviews: 432,
    },
    {
      id: 4,
      name: 'Умные часы SmartWatch X5',
      price: 12990,
      oldPrice: 15990,
      image: 'https://cdn.poehali.dev/projects/55ac4ef1-1b9a-4e49-9d71-5aabccf6d987/files/28583c73-2996-40f0-8f8a-741fd3773e75.jpg',
      rating: 4.6,
      reviews: 678,
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
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary/90">
                <Icon name="User" size={20} />
              </Button>
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary/90 relative">
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
                {products.map(renderProductCard)}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'catalog' && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">Каталог товаров</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map(renderProductCard)}
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
                {products.filter(p => favorites.includes(p.id)).map(renderProductCard)}
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="animate-fade-in max-w-2xl">
            <h2 className="text-2xl font-bold mb-6">Профиль</h2>
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center">
                  <Icon name="User" size={40} className="text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Иван Петров</h3>
                  <p className="text-muted-foreground">ivan.petrov@mail.ru</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Имя</label>
                  <Input defaultValue="Иван" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Фамилия</label>
                  <Input defaultValue="Петров" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Телефон</label>
                  <Input defaultValue="+7 (999) 123-45-67" className="mt-1" />
                </div>
                <Button className="w-full">Сохранить изменения</Button>
              </div>
            </Card>
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
    </div>
  );
};

export default Index;
