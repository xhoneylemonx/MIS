--
-- PostgreSQL database dump
--

\restrict QBQ0egjqdKcTtFieFJ4KlM0RuFuInM11tver74E0n0LPlyQFhcdvNEjH56fMw81

-- Dumped from database version 15.19
-- Dumped by pg_dump version 15.19

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Activity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Activity" (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    date text NOT NULL,
    "time" text NOT NULL,
    location text NOT NULL,
    capacity integer NOT NULL,
    "coverImage" text,
    "creatorId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Activity" OWNER TO postgres;

--
-- Name: ActivityInterest; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ActivityInterest" (
    "activityId" text NOT NULL,
    "interestId" text NOT NULL
);


ALTER TABLE public."ActivityInterest" OWNER TO postgres;

--
-- Name: ActivityParticipant; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ActivityParticipant" (
    "activityId" text NOT NULL,
    "studentId" text NOT NULL
);


ALTER TABLE public."ActivityParticipant" OWNER TO postgres;

--
-- Name: Group; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Group" (
    id text NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    "coverImage" text,
    "creatorId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Group" OWNER TO postgres;

--
-- Name: GroupInterest; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."GroupInterest" (
    "groupId" text NOT NULL,
    "interestId" text NOT NULL
);


ALTER TABLE public."GroupInterest" OWNER TO postgres;

--
-- Name: GroupMember; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."GroupMember" (
    "groupId" text NOT NULL,
    "studentId" text NOT NULL
);


ALTER TABLE public."GroupMember" OWNER TO postgres;

--
-- Name: Interest; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Interest" (
    id text NOT NULL,
    name text NOT NULL,
    icon text NOT NULL,
    "categoryId" text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "isCustom" boolean DEFAULT false NOT NULL,
    "nameLower" text NOT NULL
);


ALTER TABLE public."Interest" OWNER TO postgres;

--
-- Name: InterestCategory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."InterestCategory" (
    id text NOT NULL,
    name text NOT NULL,
    icon text NOT NULL,
    color text NOT NULL
);


ALTER TABLE public."InterestCategory" OWNER TO postgres;

--
-- Name: LookingForOption; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."LookingForOption" (
    id text NOT NULL,
    label text NOT NULL,
    icon text NOT NULL
);


ALTER TABLE public."LookingForOption" OWNER TO postgres;

--
-- Name: Student; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Student" (
    id text NOT NULL,
    "studentId" text NOT NULL,
    name text NOT NULL,
    faculty text NOT NULL,
    program text NOT NULL,
    year integer NOT NULL,
    bio text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "dataSource" text DEFAULT 'SEED'::text NOT NULL
);


ALTER TABLE public."Student" OWNER TO postgres;

--
-- Name: StudentInterest; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."StudentInterest" (
    "studentId" text NOT NULL,
    "interestId" text NOT NULL
);


ALTER TABLE public."StudentInterest" OWNER TO postgres;

--
-- Name: StudentLookingFor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."StudentLookingFor" (
    "studentId" text NOT NULL,
    "lookingForId" text NOT NULL
);


ALTER TABLE public."StudentLookingFor" OWNER TO postgres;

--
-- Name: SyncLog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SyncLog" (
    id text NOT NULL,
    source text NOT NULL,
    faculty text NOT NULL,
    program text NOT NULL,
    fetched integer NOT NULL,
    inserted integer NOT NULL,
    updated integer NOT NULL,
    skipped integer NOT NULL,
    failed integer NOT NULL,
    status text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."SyncLog" OWNER TO postgres;

--
-- Data for Name: Activity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Activity" (id, title, description, date, "time", location, capacity, "coverImage", "creatorId", "createdAt") FROM stdin;
\.


--
-- Data for Name: ActivityInterest; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ActivityInterest" ("activityId", "interestId") FROM stdin;
\.


--
-- Data for Name: ActivityParticipant; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ActivityParticipant" ("activityId", "studentId") FROM stdin;
\.


--
-- Data for Name: Group; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Group" (id, name, description, "coverImage", "creatorId", "createdAt") FROM stdin;
\.


--
-- Data for Name: GroupInterest; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."GroupInterest" ("groupId", "interestId") FROM stdin;
\.


--
-- Data for Name: GroupMember; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."GroupMember" ("groupId", "studentId") FROM stdin;
\.


--
-- Data for Name: Interest; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Interest" (id, name, icon, "categoryId", "isActive", "isCustom", "nameLower") FROM stdin;
\.


--
-- Data for Name: InterestCategory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."InterestCategory" (id, name, icon, color) FROM stdin;
\.


--
-- Data for Name: LookingForOption; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."LookingForOption" (id, label, icon) FROM stdin;
\.


--
-- Data for Name: Student; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Student" (id, "studentId", name, faculty, program, year, bio, "createdAt", "updatedAt", "dataSource") FROM stdin;
7c68d294-94b0-4e12-a6cf-ae1170561e36	6704101303	นายกฤษกร ชีวสิทธิรุ่งเรือง	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.077	2026-09-07 07:32:49.785	SEED
4ae4b313-a527-47b7-a76d-bff3553a3447	6704101315	นายจารุวัฒน์ วัจนะรัตน์	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.1	2026-09-07 07:32:49.792	SEED
dded7346-65ed-43ab-bb29-3991b07fa496	6704101310	นางสาวกุริญา ทาเทร์	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.091	2026-09-07 07:32:49.792	SEED
800a3f8f-f886-4f0e-9d84-f0419937e39f	6704101311	นางสาวกุลธิวา เมียกขุนทด	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.093	2026-09-07 07:32:49.792	SEED
e6621179-13fe-440d-af3a-04d54dd1b58f	6704101318	นายชาญณรงค์ เขมารัมย์	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.103	2026-09-07 07:32:49.794	SEED
62dedf03-ac08-4a98-ad35-cbdf0b280889	6704101317	นายจิรายุ วรรณศิลป์	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.102	2026-09-07 07:32:49.792	SEED
2f4498d6-71c4-4faa-a6f9-4737fbd3b40c	6704101306	นายก้องเกียรติ จิรวัฒนคุณากร	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.081	2026-09-07 07:32:49.788	SEED
93046776-ce09-47d1-b862-41d9e6593094	6704101319	นายชินดนัย อยู่เชียร	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.103	2026-09-07 07:32:49.794	SEED
36f12293-f9de-4e32-a861-2bea120a7033	6704101321	นายณัฐกรณ์ เตี้ยกำลังงาม	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.103	2026-09-07 07:32:49.795	SEED
4606b711-2d4c-45fe-85ae-757a46a8084b	6704101324	นายณัฐพงษ์ บุญสถิตย์	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.105	2026-09-07 07:32:49.796	SEED
102b5dba-629e-4f45-b1dd-c3cc4e6a5515	6704101326	นายณัฐภัทร ตันดี	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.105	2026-09-07 07:32:49.797	SEED
1926f7ff-922b-46b6-a06e-a03ebc48fffb	6704101327	นางสาวณิชากร คัญทัพ	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.106	2026-09-07 07:32:49.798	SEED
0e424460-5b89-4fd7-968c-b04b693a34ff	6704101328	นายติณณภพ พวงมาลา	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.106	2026-09-07 07:32:49.798	SEED
d3d2f068-d97c-4ae2-8756-5c3a8ec89ab1	6704101329	นายทินภัทร ศรีจันทร์	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.106	2026-09-07 07:32:49.798	SEED
fbd8c6cb-90c4-4518-a233-30cb6b82aac4	6704101330	นายเทวิน จันทร์ใจ	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.107	2026-09-07 07:32:49.798	SEED
74a44ca7-5cdf-44fa-8d37-fb553d4d8e5c	6704101331	นายธนกฤต เลิศประเสริฐ	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.107	2026-09-07 07:32:49.799	SEED
216ba702-df41-4c1e-b376-ea6aef909de7	6704101309	นายกิตติวงศ์ มีจันทร์	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.09	2026-09-07 07:32:49.791	SEED
02cfeb9f-11c5-4c98-a03e-eeebf7f61ea3	6704101332	นายธนธรณ์ คำต๋อ	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.107	2026-09-07 07:32:49.799	SEED
426f448d-e0ef-4189-a29f-44032c142391	6704101339	นายธีระพงษ์ อวดคม	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.109	2026-09-07 07:32:49.802	SEED
da1ed8c1-d06e-4d27-871d-52231e10562e	6704101341	นางสาวนวพร อินธิแสง	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.11	2026-09-07 07:32:49.803	SEED
e33b1119-e43d-4b35-b0f1-f7aa6021fb34	6704101350	นายประวัณวิทย์ มาไฝ	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.115	2026-09-07 07:32:49.809	SEED
f21b6679-51df-4164-8d0b-7e87ec143aaa	6704101349	นายประภวิษณุ์ บุญมา	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.114	2026-09-07 07:32:49.809	SEED
fdb5b504-06fd-4b83-9e89-45d2cd798dad	6704101358	นายพัฒธชาติ ศิริเชษฐ	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.124	2026-09-07 07:32:49.816	SEED
94ee50ce-f1a1-4ba6-b062-9ecceba4a34a	6704101359	นางสาวพัฒน์นรี วันพิลา	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.124	2026-09-07 07:32:49.818	SEED
c1c4fa08-c8a9-45dd-af62-99c94bd54147	6704101366	นายวชิรวิทย์ ปัญญาศรีวิชัย	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.135	2026-09-07 07:32:49.821	SEED
4e04bc74-8a51-4e25-864e-3796fd1f1b11	6704101367	นายวรพล จำปาโชค	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.135	2026-09-07 07:32:49.822	SEED
114f7c2a-2957-4ad4-87c4-59a24e861383	6704101372	นางสาวศุภิสรา มัควิน	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.138	2026-09-07 07:32:49.825	SEED
e9aef29d-a6a2-4bc8-a064-45e8d93c9117	6704101375	นายสหวิทย์ พสิษฐ์ไพศาล	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.142	2026-09-07 07:32:49.827	SEED
3a8162c4-f653-40fa-bb00-cd5a8f62f723	6704101380	นายสุวิศิษฏ์ ไศลบาท	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.144	2026-09-07 07:32:49.828	SEED
16c42446-863d-436c-b273-5e7db890fe28	6704101385	นายอภิสิทธิ์ เสงี่ยมกลาง	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.15	2026-09-07 07:32:49.835	SEED
921354b9-a40e-488a-909c-adee878f67e0	6704101390	นางสาวกาญจณา ประทาน	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.153	2026-09-07 07:32:49.847	SEED
1d86a2c5-e312-433e-93c4-184c47fa1501	6704101400	นายธนชาติ แจ่มแสง	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.162	2026-09-07 07:32:49.856	SEED
ac2a7020-f91b-4799-8221-097ec4e61019	6704101396	นายณัฐวัตร จานใจ	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.157	2026-09-07 07:32:49.852	SEED
58005be1-f8d2-4d9b-a6d8-9be81b72550d	6704101408	นายรพีพงศ์ ดวงคำฟู	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.172	2026-09-07 07:32:49.86	SEED
56e4d420-3e43-4ae9-9ac0-263e301ee5d4	6704101404	นายปภังกร กล้ามาก	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.17	2026-09-07 07:32:49.858	SEED
346f6ce4-7db8-41aa-80b4-fddf6abf121b	6704101414	นายสหรัตน์ ปงกา	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.174	2026-09-07 07:32:49.864	SEED
7cd67feb-0f59-43de-a866-ca11784b24d4	6704101418	นายอุดมชัย มงคล	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.176	2026-09-07 07:32:49.867	SEED
1b291214-9487-4398-96b7-8bd74d65b140	6704101334	นายธนาธิป ทองเปลว	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.108	2026-09-07 07:32:49.8	SEED
300fbbfd-2a39-4cb7-ae13-c637a10bbfc1	6704101343	นายนิตินัย อารมย์ดี	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.111	2026-09-07 07:32:49.804	SEED
2bdf283c-06b2-4c19-929a-67758ee6534c	6704101352	นายปวรปรัชญ์ ยะทอง	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.119	2026-09-07 07:32:49.811	SEED
d952c0e4-049d-45da-83a7-a6245e8b873a	6704101368	นางสาววรรณภา ฉัตรทอง	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.137	2026-09-07 07:32:49.822	SEED
2017e6a9-594b-4a34-bfec-db8535b0e037	6704101377	นายสุทธิพงษ์ เล่ห์แสน	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.142	2026-09-07 07:32:49.827	SEED
da391c90-c3d4-4ff2-880a-56ac1dec7849	6704101388	นายอานุภาพ ศรเทียน	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.151	2026-09-07 07:32:49.845	SEED
1633594b-7409-4a33-8ed6-1f61e001d2bf	6704101394	นายฐานันดร ไชยงาม	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.156	2026-09-07 07:32:49.851	SEED
57d5d268-5814-4ab4-bd4d-976ea1ddf217	6704101403	นายนภัสกร ยานะ	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.168	2026-09-07 07:32:49.858	SEED
f903a9de-4e4b-4783-b75f-bd4c1c81b8d9	6704101412	นางสาววริศรา เมืองคำ	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.173	2026-09-07 07:32:49.863	SEED
de6d0354-9792-4474-9ae0-bde6df33972c	6704101307	นายกันตศักดิ์ ตีฆาอายุ	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.084	2026-09-07 07:32:49.789	SEED
8bfc031b-6c9f-4e12-99cd-a438a8d3f392	6704101335	นายธนาวัชร์ ต๊ะทอง	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.108	2026-09-07 07:32:49.8	SEED
d9b0453e-4403-47a5-a1f8-43dbb1712c1d	6704101347	นายปณชัย กันทะสาร	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.112	2026-09-07 07:32:49.808	SEED
71bdda94-265f-4bf3-b003-f5343423eb9e	6704101354	นายปุญญพัฒน์ กลิ่นคำ	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.12	2026-09-07 07:32:49.812	SEED
a56bc014-1cd4-4073-91b5-a7459bfc678f	6704101363	นายภาณุพงษ์ เวียงห้า	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.126	2026-09-07 07:32:49.82	SEED
8078e5d5-7f63-44b9-8647-2c410c922d08	6704101370	นายวิสุทธิพันธ์ุ ไชยวัณณ์	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.138	2026-09-07 07:32:49.823	SEED
982c4b43-8746-44e4-9d59-bf13a2d0ef54	6704101379	นางสาวสุภาวดี บุญสา	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.143	2026-09-07 07:32:49.828	SEED
3bbdbbac-2ebb-404f-88fe-de1feeadbb6a	6704101387	นายอัครวุฒิ ชดช้อย	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.151	2026-09-07 07:32:49.842	SEED
4f4c73c4-7781-4a47-8e29-4f661ce99927	6704101397	นางสาวดลนภัส ภีระคำ	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.158	2026-09-07 07:32:49.853	SEED
1f5a9b5d-ede0-47b4-963b-3c33529233e2	6704101406	นางสาวมณฑกานต์ เทพสิทธิ์	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.171	2026-09-07 07:32:49.859	SEED
59b5cdfb-6301-45fa-b1e2-04c720262b2c	6704101416	นางสาวอชิรญา บุญช่วย	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.175	2026-09-07 07:32:49.866	SEED
48650124-7c7d-4c74-af79-3a438c0e0bfb	6704101336	นางสาวธมล นวลหมวก	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.108	2026-09-07 07:32:49.8	SEED
bc5586bc-c3ac-4813-870b-5ba5b7c95fdd	6704101342	นางสาวนัฐฐา จันทร์ปลอด	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.11	2026-09-07 07:32:49.803	SEED
3ee9a96e-e035-4bd6-b63b-a18573c2fc93	6704101351	นางสาวปริยากร สิงห์คง	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.117	2026-09-07 07:32:49.81	SEED
84c6eef1-ccf4-4f08-b306-5a6042d492a7	6704101360	นายพัทธนันท์ ปันตุ้ย	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.125	2026-09-07 07:32:49.819	SEED
8a4452d3-1c74-432a-beb1-450d5ca6b263	6704101369	นายวรฤทธิ์ หอมจันทร์จีรัง	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.137	2026-09-07 07:32:49.822	SEED
2605684a-0265-4177-9e53-33e9237d83d8	6704101378	นายสุธารชัย ประดิษฐกูล	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.142	2026-09-07 07:32:49.827	SEED
42dde1e2-98da-4725-8407-f97a0e41b2d5	6704101386	นายอักขรเดช จันทะชำนิ	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.15	2026-09-07 07:32:49.841	SEED
0bd818ea-b6e1-4ab8-86ea-dba7a985b79c	6704101395	นางสาวณัฐธภา ยงศิลป์วิริยะกุล	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.156	2026-09-07 07:32:49.852	SEED
10a3c99d-a3fb-4862-82f7-20a48a5e6dfb	6704101405	นางสาวเพ็ญรัศมิ์ เฮงเลิศรัตน	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.17	2026-09-07 07:32:49.859	SEED
d4ab24f3-7970-4005-b6ac-bbd5dd78a2a4	6704101413	นายศิราวุฒิ สังฆวดี	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.174	2026-09-07 07:32:49.863	SEED
6c6a9739-0f35-4106-9dbc-24722e15a1fc	6704101421	นายวรพัฒน์ นิวันติ	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.177	2026-09-07 07:32:49.868	SEED
76bc732c-145d-437c-a86c-d79fd1135a95	6704101338	นายธีรภัทร์ น้อยลา	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.109	2026-09-07 07:32:49.801	SEED
4241a801-8e80-4635-82ef-a3f5973683c5	6704101346	นายบูรพา มหัทธีรนางกูร	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.112	2026-09-07 07:32:49.808	SEED
9657a5e0-119f-4b87-8c81-2f105742543b	6704101355	นายพงศกร แก้วดำ	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.122	2026-09-07 07:32:49.813	SEED
90bc2ebd-a354-4328-b6cd-ff94f1b57e35	6704101361	นางสาวพิมพ์ลภัส หอจงกล	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.125	2026-09-07 07:32:49.819	SEED
703ff92a-2dc7-408c-9e0c-e25d545c75b0	6704101374	นายสมันตชัย นาคสุข	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.142	2026-09-07 07:32:49.827	SEED
53c7a5e6-34c8-49cf-9f5d-8acf40288d3c	6704101384	นายอภิสิทธิ์ กวินยั่งยืน	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.149	2026-09-07 07:32:49.834	SEED
bed8cfae-6a4e-4975-a296-02047c60fce5	6704101393	นางสาวชนากานต์ โสสุข	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.156	2026-09-07 07:32:49.85	SEED
b0a4dcde-572f-4dae-b657-16f6b866e635	6704101398	นายตนุวัฒน์ วรธำรงกุล	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.159	2026-09-07 07:32:49.854	SEED
8aaf3b02-ec0c-4bca-8efe-0cd80929a88d	6704101410	นายรัฐภูมิ มารู	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.172	2026-09-07 07:32:49.861	SEED
d049cb77-9e6c-42ee-b9b6-3681e422d72d	6704101417	นายอังกูร คะสาร	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.176	2026-09-07 07:32:49.866	SEED
a301d310-a208-48f1-97e4-0b82a9e8fb90	6704101337	นายธรรมจักร ราชม	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.109	2026-09-07 07:32:49.801	SEED
77099af5-5283-4933-8c71-7c1ced405339	6704101345	นายบุญนุชัย บุญเต็ม	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.111	2026-09-07 07:32:49.806	SEED
d16c99e9-2f5e-411c-a660-58f80a46e3cd	6704101357	นายพชรพล บุญรัตน์	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.124	2026-09-07 07:32:49.815	SEED
67221541-23d4-4c77-98d4-c8faf9bda07b	6704101364	นายภาณุศักดิ์ จงอักษร	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.127	2026-09-07 07:32:49.821	SEED
4aaedcff-5a79-4470-b19d-e62913e57ded	6704101371	นายศราวุฒิ ภูสี	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.138	2026-09-07 07:32:49.824	SEED
d3b52217-a30a-49eb-9b14-776a850bc317	6704101383	นายอนุศิษฐ์ จันทวรรณ	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.146	2026-09-07 07:32:49.83	SEED
76537e55-a374-4504-83c4-a1b796b298fc	6704101389	นายอิทธิพัทธ์ อินทะพันธ์	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.152	2026-09-07 07:32:49.847	SEED
860149b5-7106-494d-a4d5-ec5b0bf66728	6704101399	นายทินภัทร สัพจารย์	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.161	2026-09-07 07:32:49.855	SEED
45b9a26f-3b82-42d8-897b-c05b6a62d8ac	6704101407	นางสาวมทินา ชาวป่า	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.171	2026-09-07 07:32:49.86	SEED
4ec87dfd-70f8-400e-a0f1-532749a41372	6704101419	นายรัชกฤช หิรัญวงศ์	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.176	2026-09-07 07:32:49.867	SEED
5f7ccd7a-e004-4a09-9445-f820b6887869	6704101340	นางสาวนลินทิพย์ บุญยศ	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.11	2026-09-07 07:32:49.802	SEED
71077265-b594-46c0-96d4-ea69a81be8c6	6704101348	นายปรมะ ทวีเขตร์กิจ	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.113	2026-09-07 07:32:49.808	SEED
9d425d46-abc1-4996-8cd6-c6e815869d1f	6704101356	นางสาวพจมา คูเชอร์	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.123	2026-09-07 07:32:49.814	SEED
454052f7-39e9-474f-a21e-1429fc4675e9	6704101362	นางสาวภคพร พุ่มอยู่	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.125	2026-09-07 07:32:49.82	SEED
7e40627c-6463-40db-936a-c3951cd9a5f0	6704101376	นางสาวสุชานัน ฉวีจันทร์	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.142	2026-09-07 07:32:49.827	SEED
73970252-b085-4add-ae6a-4c0db734328e	6704101381	นางสาวแสงเฮือน -	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.145	2026-09-07 07:32:49.828	SEED
da0ba5be-ad31-4194-b32c-3adbe38bad8a	6704101391	นายคุณานนต์ ดวงตาสิทธิ์	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.154	2026-09-07 07:32:49.847	SEED
12468004-20f5-4ba0-b3c3-3795f71c597b	6704101401	นายธวัชชัย ชัยสวัสดิ์	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.163	2026-09-07 07:32:49.857	SEED
5799a509-1520-47f7-81b3-0798e63f01e1	6704101409	นางสาวรสสิวัลย์ ประสิทธิกุลวัชร์	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.172	2026-09-07 07:32:49.861	SEED
39768409-3508-4ad8-8c73-108c5c0ea62c	6704101415	นางสาวสุปรียา ปัญญานิยต	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.174	2026-09-07 07:32:49.865	SEED
c90160f8-665a-4da5-b099-3583a3515a6d	6704101305	นายกษาปณ์ ทับแฟง	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.079	2026-09-07 07:32:49.786	SEED
76881e64-d67f-4c16-ac0d-87f3e9744f40	6704101312	นายเขมโสภณ วงศ์นฤเดชากุล	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.096	2026-09-07 07:32:49.792	SEED
2063c2c5-9db3-4865-8abb-6874d0f9f7a2	6704101322	นายณัฐดนัย กองเสาร์	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.104	2026-09-07 07:32:49.796	SEED
e12bd537-f7bd-405a-8848-b8c801e82da4	6704101301	นายกชณัฐพัฒน์ พลอยเกิด	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.076	2026-09-07 07:32:49.785	SEED
9a713fc6-53ea-4987-8ea4-775653446c44	6704101313	นายคัมภีร์ ชัยนรานนท์	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.096	2026-09-07 07:32:49.792	SEED
463cf0e5-8a61-4832-9b1f-b972712ed20e	6704101308	นายก่ำ ลุคำ	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.089	2026-09-07 07:32:49.789	SEED
ff5d9cf5-7000-48d9-a9d4-8e7a7f8cd400	6704101314	นายจักรภัทร ชาบัญ	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.097	2026-09-07 07:32:49.792	SEED
c7dc3902-d570-46a0-88f7-28c2c1c3d410	6704101304	นางสาวกฤษณา โพธา	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.078	2026-09-07 07:32:49.785	SEED
35db8129-8df5-464e-915a-71a15eec71fe	6704101325	นายณัฐพล ปัญญาเพิ่ม	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.105	2026-09-07 07:32:49.797	SEED
8af6b8f8-088b-4ff1-9a58-da285bb029b1	6704101302	นายกฤตัชญ์ ถนอมรัตน์	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.076	2026-09-07 07:32:49.785	SEED
d47f2f9d-99cf-4fce-88e1-b147ce666407	6704101323	นายณัฐดนัย ปู่วงษ์	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.104	2026-09-07 07:32:49.796	SEED
963b518d-8036-40ca-a2e6-18fe8fab3fdd	6704101320	นายณรงค์พล ชูหนู	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.103	2026-09-07 07:32:49.794	SEED
4cafb1aa-2379-4027-a227-633a17858e2d	6704101333	นายธนวัต โวโลชึ่น	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.108	2026-09-07 07:32:49.799	SEED
78767bc0-81cb-4c39-a339-982e9b112657	6704101344	นางสาวนุสรินทร์ สงคุ้ม	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.111	2026-09-07 07:32:49.805	SEED
1da79b66-3b88-4e63-b348-9f5102adfb44	6704101353	นายป่าง ลุงกู	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.119	2026-09-07 07:32:49.812	SEED
6cccb0f9-8903-45f6-ba3a-33528ee41856	6704101365	นายเมธี ไชยมงคล	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.134	2026-09-07 07:32:49.821	SEED
90c84eb0-0b4f-44c8-a947-d173a544755c	6704101373	นายสมเจตน์ จ่าแดง	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.139	2026-09-07 07:32:49.826	SEED
bf03a58e-6b7f-4423-b4fc-56f61662d3e3	6704101382	นายอนุชาติ ณัฐธยานนท์	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.145	2026-09-07 07:32:49.829	SEED
80406fc8-ae55-4016-a148-8e029abfa3f0	6704101392	นายเจตพิพัฒน์ มะโนรัตน์	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.155	2026-09-07 07:32:49.85	SEED
8a597dc7-0c5b-461e-a377-d95be0371a90	6704101402	นายธาดา แกล้วทนงค์	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.166	2026-09-07 07:32:49.857	SEED
1acdd90c-9cbb-4eb2-9016-d8b34da3aa9c	6704101411	นายรัฐภูมิ สุขเนตร	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.173	2026-09-07 07:32:49.862	SEED
d4ceb559-8480-42cf-9ccd-f37bbefb7afa	6704101420	นายวุฒิโชติ เกียรตินพคุณ	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	2567	\N	2026-09-07 07:06:04.177	2026-09-07 07:32:49.868	SEED
\.


--
-- Data for Name: StudentInterest; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."StudentInterest" ("studentId", "interestId") FROM stdin;
\.


--
-- Data for Name: StudentLookingFor; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."StudentLookingFor" ("studentId", "lookingForId") FROM stdin;
\.


--
-- Data for Name: SyncLog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SyncLog" (id, source, faculty, program, fetched, inserted, updated, skipped, failed, status, "createdAt") FROM stdin;
32b7f086-adce-4014-b8e7-b2ffecf0c83a	Maejo REG	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	120	120	0	0	0	SUCCESS	2026-09-07 07:06:04.245
b343c090-6b4a-4cd1-9284-dc542ac2c70f	Maejo REG	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	108	108	0	0	0	SUCCESS	2026-09-07 07:27:36.951
f2b6d633-5e78-49ba-93eb-d0e23e1b6aa2	Maejo REG	วิทยาศาสตร์	วิทยาการคอมพิวเตอร์	120	120	0	0	0	SUCCESS	2026-09-07 07:32:49.943
\.


--
-- Name: ActivityInterest ActivityInterest_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ActivityInterest"
    ADD CONSTRAINT "ActivityInterest_pkey" PRIMARY KEY ("activityId", "interestId");


--
-- Name: ActivityParticipant ActivityParticipant_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ActivityParticipant"
    ADD CONSTRAINT "ActivityParticipant_pkey" PRIMARY KEY ("activityId", "studentId");


--
-- Name: Activity Activity_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Activity"
    ADD CONSTRAINT "Activity_pkey" PRIMARY KEY (id);


--
-- Name: GroupInterest GroupInterest_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GroupInterest"
    ADD CONSTRAINT "GroupInterest_pkey" PRIMARY KEY ("groupId", "interestId");


--
-- Name: GroupMember GroupMember_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GroupMember"
    ADD CONSTRAINT "GroupMember_pkey" PRIMARY KEY ("groupId", "studentId");


--
-- Name: Group Group_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Group"
    ADD CONSTRAINT "Group_pkey" PRIMARY KEY (id);


--
-- Name: InterestCategory InterestCategory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InterestCategory"
    ADD CONSTRAINT "InterestCategory_pkey" PRIMARY KEY (id);


--
-- Name: Interest Interest_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Interest"
    ADD CONSTRAINT "Interest_pkey" PRIMARY KEY (id);


--
-- Name: LookingForOption LookingForOption_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LookingForOption"
    ADD CONSTRAINT "LookingForOption_pkey" PRIMARY KEY (id);


--
-- Name: StudentInterest StudentInterest_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StudentInterest"
    ADD CONSTRAINT "StudentInterest_pkey" PRIMARY KEY ("studentId", "interestId");


--
-- Name: StudentLookingFor StudentLookingFor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StudentLookingFor"
    ADD CONSTRAINT "StudentLookingFor_pkey" PRIMARY KEY ("studentId", "lookingForId");


--
-- Name: Student Student_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Student"
    ADD CONSTRAINT "Student_pkey" PRIMARY KEY (id);


--
-- Name: SyncLog SyncLog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SyncLog"
    ADD CONSTRAINT "SyncLog_pkey" PRIMARY KEY (id);


--
-- Name: InterestCategory_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "InterestCategory_name_key" ON public."InterestCategory" USING btree (name);


--
-- Name: Interest_nameLower_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Interest_nameLower_key" ON public."Interest" USING btree ("nameLower");


--
-- Name: LookingForOption_label_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "LookingForOption_label_key" ON public."LookingForOption" USING btree (label);


--
-- Name: Student_studentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Student_studentId_key" ON public."Student" USING btree ("studentId");


--
-- Name: ActivityInterest ActivityInterest_activityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ActivityInterest"
    ADD CONSTRAINT "ActivityInterest_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES public."Activity"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ActivityInterest ActivityInterest_interestId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ActivityInterest"
    ADD CONSTRAINT "ActivityInterest_interestId_fkey" FOREIGN KEY ("interestId") REFERENCES public."Interest"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ActivityParticipant ActivityParticipant_activityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ActivityParticipant"
    ADD CONSTRAINT "ActivityParticipant_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES public."Activity"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ActivityParticipant ActivityParticipant_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ActivityParticipant"
    ADD CONSTRAINT "ActivityParticipant_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Activity Activity_creatorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Activity"
    ADD CONSTRAINT "Activity_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: GroupInterest GroupInterest_groupId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GroupInterest"
    ADD CONSTRAINT "GroupInterest_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES public."Group"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: GroupInterest GroupInterest_interestId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GroupInterest"
    ADD CONSTRAINT "GroupInterest_interestId_fkey" FOREIGN KEY ("interestId") REFERENCES public."Interest"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: GroupMember GroupMember_groupId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GroupMember"
    ADD CONSTRAINT "GroupMember_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES public."Group"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: GroupMember GroupMember_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GroupMember"
    ADD CONSTRAINT "GroupMember_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Group Group_creatorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Group"
    ADD CONSTRAINT "Group_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Interest Interest_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Interest"
    ADD CONSTRAINT "Interest_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."InterestCategory"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: StudentInterest StudentInterest_interestId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StudentInterest"
    ADD CONSTRAINT "StudentInterest_interestId_fkey" FOREIGN KEY ("interestId") REFERENCES public."Interest"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudentInterest StudentInterest_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StudentInterest"
    ADD CONSTRAINT "StudentInterest_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudentLookingFor StudentLookingFor_lookingForId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StudentLookingFor"
    ADD CONSTRAINT "StudentLookingFor_lookingForId_fkey" FOREIGN KEY ("lookingForId") REFERENCES public."LookingForOption"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudentLookingFor StudentLookingFor_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StudentLookingFor"
    ADD CONSTRAINT "StudentLookingFor_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict QBQ0egjqdKcTtFieFJ4KlM0RuFuInM11tver74E0n0LPlyQFhcdvNEjH56fMw81

