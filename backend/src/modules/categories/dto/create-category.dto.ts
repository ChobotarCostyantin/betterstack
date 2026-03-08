import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
    @ApiProperty({ example: 'ides', description: 'Unique slug for URL' })
    slug: string;

    @ApiProperty({ example: 'IDEs & Code Editors' })
    name: string;
}
