import React, { useMemo, useRef, useState } from 'react';
import { BrowserRouter, Link, Redirect, Route, Switch, useHistory, useLocation } from 'react-router-dom';
import {
  ArrowDown, ArrowRight, ArrowUpRight, Check, Clock3, Eye, EyeOff,
  Facebook, Instagram, Leaf, LockKeyhole, Mail, MapPin, Menu as MenuIcon, Minus, Plus,
  Search, ShieldCheck, ShoppingBag, Star, Truck, UtensilsCrossed, X,
} from 'lucide-react';
import './App.css';

const dishes = [
  { id: 1, name: 'Burrata & Heirloom Tomato', category: 'Starters', price: 14, rating: '4.9', tag: 'CHEF’S PICK', description: 'Creamy burrata, sun-ripened tomatoes, basil oil & sourdough.', image: 'photo-1608039829572-78524f79c4c7' },
  { id: 2, name: 'Wild Mushroom Risotto', category: 'Mains', price: 24, rating: '5.0', tag: 'BESTSELLER', description: 'Carnaroli rice, wild mushrooms, aged parmesan & truffle.', image: 'photo-1476124369491-e7addf5db371' },
  { id: 3, name: 'Wood-fired Margherita', category: 'Pizza', price: 19, rating: '4.8', tag: '', description: 'San Marzano tomato, fior di latte, basil & olive oil.', image: 'photo-1579751626657-72bc17010498' },
  { id: 4, name: 'Crispy Chicken Milanese', category: 'Mains', price: 26, rating: '4.9', tag: 'GUEST FAVOURITE', description: 'Herb-crusted chicken, peppery rocket & lemon parmesan.', image: 'photo-1555939594-58d7cb561ad1' },
  { id: 5, name: 'Dark Chocolate Fondant', category: 'Desserts', price: 12, rating: '4.9', tag: '', description: 'Warm Valrhona chocolate, vanilla bean gelato & sea salt.', image: 'photo-1606313564200-e75d5e30476c' },
  { id: 6, name: 'Citrus Garden Spritz', category: 'Drinks', price: 11, rating: '4.7', tag: 'ZERO PROOF', description: 'Blood orange, rosemary, sparkling citrus & a little sunshine.', image: 'photo-1544145945-f90425340c7e' },
  { id: 7, name: 'Sunday Roast Burger', category: 'Burgers', price: 22, rating: '4.8', tag: '', description: 'Dry-aged beef, smoked cheddar, onion jam & brioche.', image: 'photo-1568901346375-23c9450c58cd' },
  { id: 8, name: 'Ricotta Lemon Cake', category: 'Desserts', price: 10, rating: '4.8', tag: 'SEASONAL', description: 'Cloud-soft ricotta cake, lemon curd & fresh berries.', image: 'photo-1578985545062-69928b1d9587' },
  { id: 9, name: 'Golden Parmesan Fries', category: 'Starters', price: 9, rating: '4.7', tag: '', description: 'Hand-cut potatoes, parmesan, rosemary & roasted garlic aioli.', image: 'photo-1573080496219-bb080dd4f877' },
  { id: 10, name: 'Garden Pesto Bowl', category: 'Mains', price: 20, rating: '4.8', tag: 'PLANT-BASED', description: 'Basil pesto, charred greens, toasted seeds & lemon.', image: 'photo-1512621776951-a57141f2eefd' },
  { id: 11, name: 'Berry Cheesecake', category: 'Desserts', price: 11, rating: '4.9', tag: '', description: 'Silky vanilla cheesecake, market berries & oat crumble.', image: 'photo-1533134242443-d4fd215305ad' },
  { id: 12, name: 'Honey Pear Fizz', category: 'Drinks', price: 9, rating: '4.7', tag: '', description: 'Pear nectar, wildflower honey, thyme & sparkling water.', image: 'photo-1546173159-315724a31696' },
  { id: 13, name: 'Butter Chicken & Saffron Rice', category: 'Indian Food', price: 23, rating: '4.9', tag: 'HOUSE FAVOURITE', description: 'Slow-simmered tomato butter sauce, warming spices & basmati.', image: 'photo-1565557623262-b51c2513a641' },
  { id: 14, name: 'Paneer Tikka Masala', category: 'Indian Food', price: 21, rating: '4.8', tag: 'VEGETARIAN', description: 'Tandoor-kissed paneer, silky masala & fresh coriander.', image: 'photo-1603894584373-5ac82b2ae398' },
];

const imageUrl = (id, width = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;
const money = amount => `$${amount.toFixed(2)}`;

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('foodora_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('foodora_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [notice, setNotice] = useState('');
  const noticeTimer = useRef(null);

  const notify = message => {
    setNotice(message);
    window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(''), 3200);
  };

  const persistCart = nextCart => {
    setCart(nextCart);
    localStorage.setItem('foodora_cart', JSON.stringify(nextCart));
  };

  const addToCart = dish => {
    const existing = cart.find(item => item.id === dish.id);
    persistCart(existing
      ? cart.map(item => item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...cart, { ...dish, quantity: 1 }]);
    notify(`${dish.name} added to your bag`);
  };

  const changeQuantity = (id, change) => {
    const updated = cart
      .map(item => item.id === id ? { ...item, quantity: item.quantity + change } : item)
      .filter(item => item.quantity > 0);
    persistCart(updated);
  };

  const removeFromCart = id => persistCart(cart.filter(item => item.id !== id));
  const signOut = history => {
    localStorage.removeItem('foodora_user');
    setUser(null);
    notify('You have been signed out');
    history.push('/login');
  };

  return (
    <BrowserRouter>
      <Store
        user={user}
        setUser={setUser}
        cart={cart}
        addToCart={addToCart}
        changeQuantity={changeQuantity}
        removeFromCart={removeFromCart}
        persistCart={persistCart}
        notify={notify}
        notice={notice}
        signOut={signOut}
      />
    </BrowserRouter>
  );
}

function Store(props) {
  const history = useHistory();
  const location = useLocation();
  const { user, cart, notice, signOut } = props;
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="app-shell">
      {user && <Navbar user={user} cartCount={cartCount} signOut={() => signOut(history)} />}
      <Switch>
        <Route exact path="/login" render={() => user ? <Redirect to="/" /> : <AuthPage mode="login" onAuthenticate={props.setUser} notify={props.notify} />} />
        <Route exact path="/signup" render={() => user ? <Redirect to="/" /> : <AuthPage mode="signup" onAuthenticate={props.setUser} notify={props.notify} />} />
        <Route exact path="/" render={() => user ? <HomePage addToCart={props.addToCart} notify={props.notify} /> : <Redirect to="/login" />} />
        <Route exact path="/menu" render={() => user ? <MenuPage addToCart={props.addToCart} /> : <Redirect to="/login" />} />
        <Route exact path="/cart" render={() => user ? <CartPage cart={cart} changeQuantity={props.changeQuantity} removeFromCart={props.removeFromCart} persistCart={props.persistCart} notify={props.notify} /> : <Redirect to="/login" />} />
        <Route exact path="/about" render={() => user ? <AboutPage /> : <Redirect to="/login" />} />
        <Route exact path="/contact" render={() => user ? <ContactPage notify={props.notify} /> : <Redirect to="/login" />} />
        <Route render={() => <Redirect to={user ? '/' : { pathname: '/login', state: { from: location.pathname } }} />} />
      </Switch>
      {user && location.pathname !== '/login' && <Footer />}
      {notice && <div className="toast-message" role="status"><Check size={17} />{notice}</div>}
    </div>
  );
}

function Navbar({ user, cartCount, signOut }) {
  const [open, setOpen] = useState(false);
  const links = [['Home', '/'], ['Menu', '/menu'], ['Our story', '/about'], ['Contact', '/contact']];
  return (
    <header className="site-header">
      <div className="announcement"><span>GOOD FOOD, GOOD MOOD.</span><span className="announcement-center">A little something special, made fresh every day.</span><a href="tel:+12125550148">RESERVATIONS&nbsp; +1 (212) 555-0148</a></div>
      <nav className="navbar content-wrap">
        <Link className="brand" to="/" aria-label="Foodora home"><span className="brand-mark"><UtensilsCrossed size={21} /></span><span>foodora<span className="brand-period">.</span><small>GOOD FOOD, GATHERED</small></span></Link>
        <button className="mobile-menu-toggle" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <X /> : <MenuIcon />}</button>
        <div className={`nav-links ${open ? 'nav-open' : ''}`}>
          {links.map(([label, path]) => <Link key={path} to={path} onClick={() => setOpen(false)}>{label}</Link>)}
          <div className="nav-actions">
            <span className="welcome-name">Hi, {user.name.split(' ')[0]}</span>
            <Link className="cart-link" to="/cart" aria-label={`Shopping bag, ${cartCount} items`}><ShoppingBag size={19} /><span>Bag</span>{cartCount > 0 && <b>{cartCount}</b>}</Link>
            <button className="signout-link" onClick={signOut}>Sign out</button>
          </div>
        </div>
      </nav>
    </header>
  );
}

function AuthPage({ mode, onAuthenticate, notify }) {
  const history = useHistory();
  const isSignup = mode === 'signup';
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const update = event => setForm({ ...form, [event.target.name]: event.target.value });

  const submit = event => {
    event.preventDefault();
    setError('');
    const email = form.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Enter a valid email address.');
    if (form.password.length < 8) return setError('Your password must be at least 8 characters.');
    if (isSignup) {
      if (form.name.trim().length < 2) return setError('Please enter your name.');
      if (form.password !== form.confirm) return setError('Those passwords don’t match. Try again.');
      const accounts = JSON.parse(localStorage.getItem('foodora_accounts') || '[]');
      if (accounts.some(account => account.email === email)) return setError('An account with this email already exists. Please sign in.');
      const account = { name: form.name.trim(), email, password: form.password };
      localStorage.setItem('foodora_accounts', JSON.stringify([...accounts, account]));
      const currentUser = { name: account.name, email };
      localStorage.setItem('foodora_user', JSON.stringify(currentUser));
      onAuthenticate(currentUser);
      notify(`Welcome to the table, ${account.name.split(' ')[0]}!`);
      history.push('/');
      return;
    }
    const accounts = JSON.parse(localStorage.getItem('foodora_accounts') || '[]');
    const account = accounts.find(item => item.email === email && item.password === form.password);
    if (!account) return setError('We couldn’t find that email and password combination.');
    const currentUser = { name: account.name, email };
    localStorage.setItem('foodora_user', JSON.stringify(currentUser));
    onAuthenticate(currentUser);
    notify(`Welcome back, ${account.name.split(' ')[0]}!`);
    history.push('/');
  };

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <div className="auth-image" />
        <Link to="/login" className="auth-brand"><span className="brand-mark"><UtensilsCrossed size={21} /></span><span>foodora<span className="brand-period">.</span><small>GOOD FOOD, GATHERED</small></span></Link>
        <div className="auth-quote"><span className="eyebrow light-eyebrow">A SEAT AT OUR TABLE</span><h2>Good food.<br />Better together.</h2><p>Thoughtful ingredients, honest cooking, and a little bit of magic in every bite.</p><div className="quote-stars"><Star fill="currentColor" /><Star fill="currentColor" /><Star fill="currentColor" /><Star fill="currentColor" /><Star fill="currentColor" /><span>LOVED BY OUR NEIGHBOURHOOD</span></div></div>
        <div className="auth-visual-bottom"><span>SEASONAL. LOCAL. ALWAYS MADE WITH LOVE.</span><span>EST. 2018 · NEW YORK</span></div>
      </section>
      <section className="auth-panel">
        <div className="auth-card">
          <div className="auth-mobile-brand"><UtensilsCrossed size={19} /> foodora<span>.</span></div>
          <span className="eyebrow">{isSignup ? 'YOUR TABLE IS WAITING' : 'WELCOME BACK'}</span>
          <h1>{isSignup ? 'Let’s get to know you.' : 'Good to have you back.'}</h1>
          <p className="auth-subtitle">{isSignup ? 'Create an account and make every meal a little more special.' : 'Sign in for your favourite dishes, ready when you are.'}</p>
          <form onSubmit={submit} noValidate>
            {isSignup && <label className="field-label">Your name<div className="input-wrap"><input name="name" autoComplete="name" placeholder="e.g. Alex Morgan" value={form.name} onChange={update} required /><UtensilsCrossed size={17} /></div></label>}
            <label className="field-label">Email address<div className="input-wrap"><input name="email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={update} required /><Mail size={17} /></div></label>
            <label className="field-label">Password<div className="input-wrap"><input name="password" type={showPassword ? 'text' : 'password'} autoComplete={isSignup ? 'new-password' : 'current-password'} placeholder="At least 8 characters" value={form.password} onChange={update} required minLength="8" /><button className="password-toggle" type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>
            {isSignup && <label className="field-label">Confirm password<div className="input-wrap"><input name="confirm" type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Enter your password again" value={form.confirm} onChange={update} required /><LockKeyhole size={17} /></div></label>}
            {error && <p className="form-error" role="alert">{error}</p>}
            {!isSignup && <div className="remember-line"><span><ShieldCheck size={15} /> Your table, your details, always secure.</span></div>}
            <button className="button button-dark auth-submit" type="submit">{isSignup ? 'Create my account' : 'Sign in'}<ArrowRight size={17} /></button>
          </form>
          <p className="auth-switch">{isSignup ? 'Already part of the table?' : 'New to Foodora?'} <Link to={isSignup ? '/login' : '/signup'}>{isSignup ? 'Sign in' : 'Create an account'}</Link></p>
          <p className="auth-legal">By continuing, you agree to Foodora’s terms and privacy policy.</p>
        </div>
      </section>
    </main>
  );
}

function DishCard({ dish, addToCart }) {
  return (
    <article className="dish-card">
      <div className="dish-image-wrap">
        <img src={imageUrl(dish.image, 700)} alt={dish.name} loading="lazy" />
        {dish.tag && <span className="dish-tag">{dish.tag}</span>}
        <button className="dish-add" onClick={() => addToCart(dish)} aria-label={`Add ${dish.name} to bag`}><Plus size={19} /></button>
      </div>
      <div className="dish-details"><div className="dish-meta"><span>{dish.category.toUpperCase()}</span><span className="dish-rating"><Star size={13} fill="currentColor" /> {dish.rating}</span></div><div className="dish-title-row"><h3>{dish.name}</h3><span>{money(dish.price)}</span></div><p>{dish.description}</p></div>
    </article>
  );
}

function HomePage({ addToCart, notify }) {
  return (
    <main>
      <section className="hero-section">
        <div className="hero-copy"><span className="eyebrow">GOOD FOOD, GATHERED</span><h1>A little more<br />love on <em>your plate.</em></h1><p>Season-led cooking, ingredients with a story, and the kind of meal that turns tonight into a favourite memory.</p><div className="hero-actions"><Link className="button button-dark" to="/menu">Explore the menu <ArrowRight size={17} /></Link><a className="text-link" href="#our-way">Our way of doing things <ArrowDown size={16} /></a></div><div className="hero-social-proof"><div className="avatar-stack"><span>A</span><span>M</span><span>S</span><span>J</span></div><div><span className="stars-small">★★★★★</span><small>4.9/5 from 2,400+ happy guests</small></div></div></div>
        <div className="hero-photo"><img src={imageUrl('photo-1547592180-85f173990554', 1500)} alt="A table filled with colourful, freshly prepared food" /><div className="hero-image-note"><span className="note-icon"><Leaf size={17} /></span><span><b>Fresh, always.</b><small>From local farms to your table</small></span></div><div className="hero-number">01 <span>— 04</span></div></div>
      </section>
      <div className="benefit-strip"><div><Leaf /><span><b>Thoughtfully sourced</b><small>Good things, grown close</small></span></div><div><Clock3 /><span><b>Made fresh to order</b><small>Never rushed, never frozen</small></span></div><div><Truck /><span><b>At your door in 30</b><small>Warm, right on time</small></span></div><div><ShieldCheck /><span><b>Feel-good guarantee</b><small>Love every single bite</small></span></div></div>
      <section className="section-wrap" id="our-way"><div className="section-heading"><div><span className="eyebrow">FROM OUR KITCHEN, WITH LOVE</span><h2>A few good things.</h2><p>Our most-loved plates, made for sharing. Or not. We don’t judge.</p></div><Link className="text-link" to="/menu">See everything <ArrowRight size={16} /></Link></div><div className="dish-grid">{dishes.slice(0, 4).map(dish => <DishCard key={dish.id} dish={dish} addToCart={addToCart} />)}</div></section>
      <section className="offer-banner"><div className="offer-copy"><span className="eyebrow light-eyebrow">A LITTLE TREAT FROM US</span><h2>Make tonight<br />a <em>little special.</em></h2><p>Take 15% off your first order, because good things are better when shared.</p><Link className="button button-cream" to="/menu">Order something lovely <ArrowRight size={17} /></Link><small>USE CODE <b>FIRSTBITE</b> AT CHECKOUT</small></div><div className="offer-photo"><img src={imageUrl('photo-1517701550927-30cf4ba1dba5', 1100)} alt="A freshly prepared gourmet meal" /><span className="offer-stamp">15%<small>OFF</small></span></div></section>
      <section className="quote-section"><span className="eyebrow">KIND WORDS, FULL HEARTS</span><div className="quote-stars quote-stars-dark">★★★★★</div><blockquote>“The kind of food that makes you put your phone down and pass the plate around.”</blockquote><div className="quote-author"><span className="author-avatar">J</span><span><b>Jamie L.</b><small>REGULAR SINCE 2021</small></span></div><div className="quote-count">01&nbsp; / &nbsp;03</div></section>
      <Newsletter notify={notify} />
    </main>
  );
}

function Newsletter({ notify }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const submit = event => {
    event.preventDefault();
    const address = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) return setError('Enter a valid email address.');
    const subscribers = JSON.parse(localStorage.getItem('foodora_subscribers') || '[]');
    if (!subscribers.includes(address)) localStorage.setItem('foodora_subscribers', JSON.stringify([...subscribers, address]));
    setEmail('');
    setError('');
    setSubscribed(true);
    notify('You’re on the list. Good things are on their way!');
  };
  return <section className="newsletter-strip"><div><span className="eyebrow">GOOD THINGS IN YOUR INBOX</span><h2>Stay a little hungry.</h2><p>{subscribed ? 'You’re on the list. We’ll save you a little something.' : 'Seasonal specials, a few stories from our kitchen, and a treat on your birthday.'}</p>{error && <span className="newsletter-error" role="alert">{error}</span>}</div><form onSubmit={submit} className="newsletter-form"><label className="newsletter-input"><Mail size={16} /><input type="email" placeholder="Your email address" value={email} onChange={event => setEmail(event.target.value)} aria-label="Your email address" required /></label><button className="button button-dark" type="submit">{subscribed ? 'You’re subscribed' : 'Count me in'}<ArrowRight size={17} /></button></form></section>;
}

function MenuPage({ addToCart }) {
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const categories = ['All', 'Pizza', 'Burgers', 'Indian Food', 'Starters', 'Mains', 'Desserts', 'Drinks'];
  const filtered = useMemo(() => dishes.filter(dish =>
    (category === 'All' || dish.category === category) &&
    `${dish.name} ${dish.description} ${dish.category}`.toLowerCase().includes(query.toLowerCase())
  ), [category, query]);
  return (
    <main className="menu-page">
      <section className="page-intro"><span className="eyebrow">MADE WITH CARE, SERVED WITH JOY</span><h1>Good things<br /><em>on the menu.</em></h1><p>Seasonal ingredients. Familiar favourites. A few lovely surprises.</p><div className="menu-page-art"><img src={imageUrl('photo-1547592180-85f173990554', 700)} alt="Fresh seasonal dishes from our kitchen" /></div></section>
      <section className="menu-catalog section-wrap"><div className="menu-toolbar"><div className="category-pills">{categories.map(item => <button key={item} className={category === item ? 'category-pill active' : 'category-pill'} onClick={() => setCategory(item)}>{item}</button>)}</div><label className="menu-search"><Search size={17} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Find your favourite..." aria-label="Search menu" />{query && <button onClick={() => setQuery('')} aria-label="Clear search"><X size={15} /></button>}</label></div>
        <div className="menu-results"><span>{filtered.length} delicious {filtered.length === 1 ? 'thing' : 'things'}</span><span>MADE FRESH, EVERY DAY</span></div>
        {filtered.length > 0 ? <div className="dish-grid menu-grid">{filtered.map(dish => <DishCard key={dish.id} dish={dish} addToCart={addToCart} />)}</div> : <div className="empty-search"><Search size={25} /><h3>Nothing on our menu just yet.</h3><p>Try a different search or browse another category.</p><button className="text-link" onClick={() => { setQuery(''); setCategory('All'); }}>Show me everything <ArrowRight size={16} /></button></div>}
      </section>
    </main>
  );
}

function CartPage({ cart, changeQuantity, removeFromCart, persistCart, notify }) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const [ordered, setOrdered] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const discount = promoApplied ? subtotal * 0.15 : 0;
  const delivery = subtotal >= 45 ? 0 : 3.5;
  const checkout = () => {
    persistCart([]);
    setOrdered(true);
    notify('Your order is in! We’re getting cooking.');
  };
  if (ordered) return <main className="cart-page section-wrap order-confirmation"><span className="confirmation-icon"><Check size={32} /></span><span className="eyebrow">THAT’S A GOOD CHOICE</span><h1>Your order is<br /><em>in the works.</em></h1><p>We’ve got your order. Our kitchen is already getting started.</p><span className="order-reference">ORDER #FD-{Math.floor(10000 + Math.random() * 90000)}</span><Link className="button button-dark" to="/menu">Back to the menu <ArrowRight size={17} /></Link></main>;
  return (
    <main className="cart-page section-wrap"><div className="cart-intro"><span className="eyebrow">A VERY GOOD DECISION</span><h1>Your bag<span>.</span></h1><p>{cart.length ? 'A few lovely things, on their way to you.' : 'Good things are only a few clicks away.'}</p></div>
      {cart.length ? <div className="cart-layout"><div className="cart-items">{cart.map(item => <article className="cart-item" key={item.id}><img src={imageUrl(item.image, 400)} alt={item.name} /><div className="cart-item-info"><span>{item.category.toUpperCase()}</span><h3>{item.name}</h3><p>{item.description}</p><div className="quantity-control"><button onClick={() => changeQuantity(item.id, -1)} aria-label={`Decrease ${item.name} quantity`}><Minus size={14} /></button><span>{item.quantity}</span><button onClick={() => changeQuantity(item.id, 1)} aria-label={`Increase ${item.name} quantity`}><Plus size={14} /></button><button className="remove-item" onClick={() => removeFromCart(item.id)}>Remove</button></div></div><strong>{money(item.price * item.quantity)}</strong></article>)}</div><aside className="order-summary"><span className="eyebrow">THE GOOD STUFF</span><h2>Order summary</h2><form className="promo-form" onSubmit={event => { event.preventDefault(); if (promoCode.trim().toUpperCase() !== 'FIRSTBITE') { setPromoError('That code didn’t work. Try FIRSTBITE.'); return; } setPromoError(''); setPromoApplied(true); notify('FIRSTBITE applied — enjoy 15% off!'); }}><label htmlFor="promo-code">Have a little treat?</label><div><input id="promo-code" value={promoCode} onChange={event => { setPromoCode(event.target.value); setPromoError(''); }} placeholder="Enter a promo code" /><button type="submit" disabled={promoApplied}>{promoApplied ? 'Applied' : 'Apply'}</button></div>{promoError && <p className="promo-error" role="alert">{promoError}</p>}</form><div className="summary-row"><span>Subtotal</span><span>{money(subtotal)}</span></div>{promoApplied && <div className="summary-row promo-savings"><span>FIRSTBITE (15%)</span><span>−{money(discount)}</span></div>}<div className="summary-row"><span>Delivery</span><span>{delivery === 0 ? 'On us' : money(delivery)}</span></div><div className="summary-row"><span>Service</span><span>On us</span></div><div className="summary-total"><span>Total</span><strong>{money(subtotal - discount + delivery)}</strong></div><button className="button button-dark checkout-button" onClick={checkout}>Place my order <ArrowRight size={17} /></button><small><ShieldCheck size={14} /> Safe, secure, and seriously delicious.</small><p>Checkout is a frontend demo. No payment will be collected.</p></aside></div> : <div className="empty-cart"><span className="empty-cart-icon"><ShoppingBag size={28} /></span><h2>Your bag’s feeling a little lonely.</h2><p>Let’s find something lovely to fill it with.</p><Link className="button button-dark" to="/menu">Explore the menu <ArrowRight size={17} /></Link></div>}
    </main>
  );
}

function AboutPage() {
  return (
    <main className="about-page"><section className="about-hero"><div><span className="eyebrow">A TABLE FOR EVERYONE</span><h1>Good food.<br />Good people.<br /><em>That’s the whole thing.</em></h1><p>We believe a great meal is never just a meal. It’s a reason to slow down, lean in, and stay a little longer.</p></div><img src={imageUrl('photo-1414235077428-338989a2e8c0', 1200)} alt="Friends sharing a meal around a warmly lit restaurant table" /></section><section className="about-story section-wrap"><div className="about-story-image"><img src={imageUrl('photo-1556911220-e15b29be8c8f', 950)} alt="A chef preparing seasonal ingredients in the Foodora kitchen" /><span>IN OUR KITCHEN, EVERY DAY.</span></div><div className="about-story-copy"><span className="eyebrow">A LITTLE ABOUT US</span><h2>It started with a table, and a lot of good food.</h2><p>Back in 2018, we opened a small neighbourhood kitchen with one simple idea: make food that brings people together. No fuss, no shortcuts. Just beautiful ingredients, cooked with care.</p><p>Today, that same little idea is at the heart of everything we do. We work with farmers and makers just down the road, cook with the seasons, and make every dish like someone we love is coming over for dinner.</p><Link to="/menu" className="text-link">Come hungry <ArrowRight size={16} /></Link></div></section><section className="values-section"><div className="section-wrap"><div className="section-heading"><div><span className="eyebrow">THE WAY WE SEE IT</span><h2>Three things we believe.</h2></div></div><div className="values-grid"><article><span>01</span><Leaf /><h3>Good food starts at the source.</h3><p>We partner with local growers and choose ingredients that are in season, full of flavour, and good for the long run.</p></article><article><span>02</span><UtensilsCrossed /><h3>Care is the secret ingredient.</h3><p>Everything is cooked to order by people who love what they do. You can taste the difference.</p></article><article><span>03</span><HeartIcon /><h3>There’s always room at the table.</h3><p>Good food is for everyone. We’re here to make all kinds of gatherings feel a little more special.</p></article></div></div></section><section className="about-cta"><span className="eyebrow light-eyebrow">SOMETHING GOOD IS COOKING</span><h2>Come on in.<br /><em>We saved you a seat.</em></h2><Link to="/menu" className="button button-cream">See what’s cooking <ArrowRight size={17} /></Link></section></main>
  );
}

function HeartIcon() {
  return <span className="heart-icon">♥</span>;
}

function ContactPage({ notify }) {
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const submit = event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get('name').trim();
    const email = data.get('email').trim();
    const message = data.get('message').trim();
    if (name.length < 2) return setError('Please enter your name.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Enter a valid email address.');
    if (message.length < 10) return setError('Tell us a little more (at least 10 characters).');
    setError('');
    setSent(true);
    event.currentTarget.reset();
    notify('Thanks for the note. We’ll be in touch soon!');
  };
  return <main className="contact-page section-wrap"><section className="contact-intro"><span className="eyebrow">WE’RE ALL EARS</span><h1>Say hello<span>.</span></h1><p>Questions, kind words, or a really good recipe? We’d love to hear from you.</p><div className="contact-details"><a href="mailto:hello@foodora.com"><span><Mail size={18} /></span><div><small>DROP US A LINE</small><b>hello@foodora.com</b></div></a><a href="tel:+12125550148"><span><UtensilsCrossed size={18} /></span><div><small>GIVE US A RING</small><b>+1 (212) 555-0148</b></div></a><div><span><MapPin size={18} /></span><div><small>COME ON OVER</small><b>18 Spring Street, New York, NY</b></div></div></div></section><section className="contact-form-panel"><span className="eyebrow">SEND A LITTLE NOTE</span><h2>What’s on your mind?</h2>{sent ? <div className="contact-success"><span><Check size={22} /></span><h3>That’s lovely of you.</h3><p>Your note is on its way. We’ll get back to you within one business day.</p><button className="text-link" onClick={() => setSent(false)}>Send another message <ArrowRight size={15} /></button></div> : <form onSubmit={submit} noValidate><label className="field-label">Your name<input className="contact-input" name="name" placeholder="Alex Morgan" required /></label><label className="field-label">Email address<input className="contact-input" name="email" type="email" placeholder="you@example.com" required /></label><label className="field-label">Your message<textarea className="contact-input" name="message" rows="5" placeholder="Tell us what’s on your mind..." required /></label>{error && <p className="form-error" role="alert">{error}</p>}<button type="submit" className="button button-dark">Send your note <ArrowRight size={17} /></button></form>}</section></main>;
}

function Footer() {
  return <footer className="site-footer"><div className="footer-main content-wrap"><div className="footer-brand"><Link className="brand footer-logo" to="/"><span className="brand-mark"><UtensilsCrossed size={21} /></span><span>foodora<span className="brand-period">.</span><small>GOOD FOOD, GATHERED</small></span></Link><p>Thoughtful food for the moments that matter. Made fresh, made with love, made for you.</p><div className="social-links"><a href="https://www.instagram.com/" aria-label="Instagram"><Instagram size={17} /></a><a href="https://www.facebook.com/" aria-label="Facebook"><Facebook size={17} /></a></div></div><div className="footer-column"><span>FIND YOUR WAY</span><Link to="/">Home</Link><Link to="/menu">Our menu</Link><Link to="/about">Our story</Link><Link to="/contact">Get in touch</Link></div><div className="footer-column"><span>COME ON OVER</span><p>18 Spring Street<br />New York, NY 10012</p><p>Mon–Fri&nbsp; 11am — 10pm<br />Sat–Sun&nbsp; 10am — 11pm</p></div><div className="footer-note"><span className="eyebrow light-eyebrow">MADE WITH LOVE IN NEW YORK</span><h3>Come hungry.<br /><em>Leave happy.</em></h3><Link to="/menu">A table is waiting <ArrowUpRight size={16} /></Link></div></div><div className="footer-bottom content-wrap"><span>© {new Date().getFullYear()} FOODORA. GOOD FOOD, GATHERED.</span><span>GOOD FOOD. GOOD PEOPLE. GOOD PLANET.</span></div></footer>;
}

export default App;
